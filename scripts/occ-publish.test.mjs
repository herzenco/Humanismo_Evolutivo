import assert from "node:assert/strict";
import test from "node:test";
import { createPublishHandler, secretMatches, validatePublishEvent } from "./lib/occ-publish.mjs";

const env = {
  OCC_CONTENT_PROPERTY: "humanismo-evolutivo",
  OCC_PUBLISH_WEBHOOK_SECRET: "shared-secret",
  VERCEL_DEPLOY_HOOK_URL: "https://api.vercel.com/v1/integrations/deploy/project/hook",
};
const payload = {
  event_id: "11111111-1111-4111-8111-111111111111",
  event: "content.published",
  property: "humanismo-evolutivo",
  content_id: "22222222-2222-4222-8222-222222222222",
  slug: "conciencia-colectiva",
  occurred_at: "2026-08-14T18:00:00.000Z",
};
const logger = { info() {}, error() {} };

function publicationRequest(body = payload, token = "shared-secret", method = "POST") {
  return new Request("https://yosoynosotros.org/api/publish", {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    ...(method === "POST" ? { body: JSON.stringify(body) } : {}),
  });
}

test("compares webhook secrets without accepting empty or unequal values", () => {
  assert.equal(secretMatches("shared-secret", "shared-secret"), true);
  assert.equal(secretMatches("", ""), false);
  assert.equal(secretMatches("wrong", "shared-secret"), false);
});

test("validates the complete publication event contract", () => {
  assert.equal(validatePublishEvent(payload, env.OCC_CONTENT_PROPERTY), true);
  assert.equal(validatePublishEvent({ ...payload, event: "content.deleted" }, env.OCC_CONTENT_PROPERTY), false);
  assert.equal(validatePublishEvent({ ...payload, slug: "Unsafe Slug" }, env.OCC_CONTENT_PROPERTY), false);
  assert.equal(validatePublishEvent({ ...payload, property: "other" }, env.OCC_CONTENT_PROPERTY), false);
  assert.equal(validatePublishEvent({ ...payload, occurred_at: "yesterday" }, env.OCC_CONTENT_PROPERTY), false);
});

test("accepts an authenticated event and forwards only invalidation metadata", async () => {
  let deployBody;
  const handler = createPublishHandler({
    env,
    deliveries: new Map(),
    logger,
    fetchImpl: async (_url, options) => {
      deployBody = JSON.parse(options.body);
      return new Response(null, { status: 201 });
    },
  });

  const response = await handler(publicationRequest());
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { accepted: true, event_id: payload.event_id });
  assert.equal(deployBody.slug, payload.slug);
  assert.equal("body" in deployBody, false);
  assert.equal("occurred_at" in deployBody, false);
});

test("deduplicates successful event IDs in the warm function instance", async () => {
  let deployCalls = 0;
  const handler = createPublishHandler({
    env,
    deliveries: new Map(),
    logger,
    fetchImpl: async () => {
      deployCalls += 1;
      return new Response(null, { status: 201 });
    },
  });

  assert.equal((await handler(publicationRequest())).status, 202);
  const duplicate = await handler(publicationRequest());
  assert.equal(duplicate.status, 202);
  assert.equal((await duplicate.json()).duplicate, true);
  assert.equal(deployCalls, 1);
});

test("keeps a failed deploy-hook event retryable", async () => {
  let deployCalls = 0;
  const handler = createPublishHandler({
    env,
    deliveries: new Map(),
    logger,
    fetchImpl: async () => {
      deployCalls += 1;
      return new Response(null, { status: deployCalls === 1 ? 503 : 201 });
    },
  });

  assert.equal((await handler(publicationRequest())).status, 502);
  assert.equal((await handler(publicationRequest())).status, 202);
  assert.equal(deployCalls, 2);
});

test("returns the specified method, configuration, authentication, and contract errors", async () => {
  const handler = createPublishHandler({ env, deliveries: new Map(), logger, fetchImpl: async () => new Response() });
  const methodResponse = await handler(publicationRequest(payload, "shared-secret", "GET"));
  assert.equal(methodResponse.status, 405);
  assert.equal(methodResponse.headers.get("allow"), "POST");
  assert.equal((await handler(publicationRequest(payload, "wrong"))).status, 401);
  assert.equal((await handler(publicationRequest({ ...payload, slug: "Bad Slug" }))).status, 400);

  const unconfigured = createPublishHandler({ env: {}, deliveries: new Map(), logger });
  assert.equal((await unconfigured(publicationRequest())).status, 500);
});

test("rejects invalid JSON", async () => {
  const handler = createPublishHandler({ env, deliveries: new Map(), logger });
  const response = await handler(
    new Request("https://yosoynosotros.org/api/publish", {
      method: "POST",
      headers: {
        authorization: "Bearer shared-secret",
        "content-type": "application/json",
      },
      body: "not-json",
    }),
  );
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "invalid_json" });
});
