"use client";

import { useEffect } from "react";

type ResourceAnalyticsProps = {
  pageType: "resources_index" | "resource_article";
  contentSlug?: string;
};

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

function pushEvent(event: string, properties: Record<string, string | number> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...properties });
}

function calculateScrollDepth() {
  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );
  if (documentHeight <= window.innerHeight) return 100;

  return Math.min(
    100,
    Math.max(0, Math.round(((window.scrollY + window.innerHeight) / documentHeight) * 100)),
  );
}

export function ResourceAnalytics({ pageType, contentSlug }: ResourceAnalyticsProps) {
  useEffect(() => {
    let activeSeconds = 0;
    let maxScrollDepth = calculateScrollDepth();
    let engagementSent = false;
    let readCompleted = false;
    const reachedThresholds = new Set<number>();
    const context = {
      page_type: pageType,
      ...(contentSlug ? { content_slug: contentSlug } : {}),
    };

    const maybeTrackReadCompleted = () => {
      if (
        readCompleted ||
        pageType !== "resource_article" ||
        activeSeconds < 30 ||
        maxScrollDepth < 90
      ) {
        return;
      }

      readCompleted = true;
      pushEvent("resource_read_completed", {
        ...context,
        active_seconds: activeSeconds,
        max_scroll_depth_percent: maxScrollDepth,
      });
    };

    const recordScrollDepth = () => {
      const depth = calculateScrollDepth();
      maxScrollDepth = Math.max(maxScrollDepth, depth);

      for (const threshold of SCROLL_THRESHOLDS) {
        if (depth >= threshold && !reachedThresholds.has(threshold)) {
          reachedThresholds.add(threshold);
          pushEvent("scroll_depth_reached", {
            ...context,
            scroll_depth_percent: threshold,
          });
        }
      }

      maybeTrackReadCompleted();
    };

    const sendEngagement = () => {
      if (engagementSent || activeSeconds < 1) return;
      engagementSent = true;
      maxScrollDepth = Math.max(maxScrollDepth, calculateScrollDepth());
      pushEvent("page_engagement_completed", {
        ...context,
        active_seconds: activeSeconds,
        max_scroll_depth_percent: maxScrollDepth,
      });
    };

    pushEvent("page_viewed", context);
    recordScrollDepth();

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible" || !document.hasFocus()) return;
      activeSeconds += 1;
      maybeTrackReadCompleted();
    }, 1000);

    window.addEventListener("scroll", recordScrollDepth, { passive: true });
    window.addEventListener("pagehide", sendEngagement);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", recordScrollDepth);
      window.removeEventListener("pagehide", sendEngagement);
      sendEngagement();
    };
  }, [contentSlug, pageType]);

  return null;
}
