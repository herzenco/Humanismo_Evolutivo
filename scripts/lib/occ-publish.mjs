import { timingSafeEqual } from "node:crypto";

const EVENTS = new Set([
  "content.published",
  "content.updated",
  "content.unpublished",
  "content.archived",
]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;
const sharedDeliveries = new Map();

function json(status, body, headers = {}) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

export function secretMatches(provided, expected) {
  const left = Buffer.from(provided || "");
  const right = Buffer.from(expected || "");
  return left.length > 0 && left.length === right.length && timingSafeEqual(left, right);
}

export function validatePublishEvent(payload, property) {
  return (
    Boolean(payload) &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    UUID.test(typeof payload.event_id === "string" ? payload.event_id : "") &&
    EVENTS.has(payload.event) &&
    payload.property === property &&
    UUID.test(typeof payload.content_id === "string" ? payload.content_id : "") &&
    SLUG.test(typeof payload.slug === "string" ? payload.slug : "") &&
    typeof payload.occurred_at === "string" &&
    ISO_TIMESTAMP.test(payload.occurred_at) &&
    Number.isFinite(Date.parse(payload.occurred_at))
  );
}

function remember(deliveries, eventId, value) {
  deliveries.set(eventId, value);
  if (deliveries.size > 500) {
    deliveries.delete(deliveries.keys().next().value);
  }
}

async function triggerDeployment(fetchImpl, deployHookUrl, payload) {
  const response = await fetchImpl(deployHookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      source: "occ-content-publishing",
      event_id: payload.event_id,
      event: payload.event,
      property: payload.property,
      content_id: payload.content_id,
      slug: payload.slug,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`deploy_hook_${response.status}`);
  }
}

export function createPublishHandler({
  env = process.env,
  fetchImpl = fetch,
  deliveries = sharedDeliveries,
  logger = console,
} = {}) {
  return async function handlePublish(request) {
    if (request.method !== "POST") {
      return json(405, { error: "method_not_allowed" }, { allow: "POST" });
    }

    const property = env.OCC_CONTENT_PROPERTY || "";
    const secret = env.OCC_PUBLISH_WEBHOOK_SECRET || "";
    const deployHookUrl = env.VERCEL_DEPLOY_HOOK_URL || "";
    if (!property || !secret || !deployHookUrl) {
      return json(500, { error: "server_not_configured" });
    }

    try {
      const hook = new URL(deployHookUrl);
      if (!['http:', 'https:'].includes(hook.protocol)) throw new Error("invalid_protocol");
    } catch {
      return json(500, { error: "server_not_configured" });
    }

    const authorization = request.headers.get("authorization") || "";
    const providedSecret = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!secretMatches(providedSecret, secret)) {
      return json(401, { error: "invalid_secret" });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json(400, { error: "invalid_json" });
    }
    if (!validatePublishEvent(payload, property)) {
      return json(400, { error: "invalid_event" });
    }

    const existing = deliveries.get(payload.event_id);
    if (existing) {
      try {
        await existing;
        return json(202, { accepted: true, duplicate: true, event_id: payload.event_id });
      } catch {
        if (deliveries.get(payload.event_id) === existing) {
          deliveries.delete(payload.event_id);
        }
      }
    }

    const deployment = triggerDeployment(fetchImpl, deployHookUrl, payload);
    remember(deliveries, payload.event_id, deployment);

    try {
      await deployment;
      remember(deliveries, payload.event_id, Promise.resolve());
      logger.info("OCC publication event accepted", {
        event_id: payload.event_id,
        event: payload.event,
        slug: payload.slug,
      });
      return json(202, { accepted: true, event_id: payload.event_id });
    } catch (error) {
      if (deliveries.get(payload.event_id) === deployment) {
        deliveries.delete(payload.event_id);
      }
      logger.error("OCC publication deployment trigger failed", {
        event_id: payload.event_id,
        error: error instanceof Error ? error.name : "Error",
      });
      return json(502, { error: "deployment_hook_failed" });
    }
  };
}

export function resetPublishStateForTests() {
  sharedDeliveries.clear();
}
