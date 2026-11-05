import { createPublishHandler } from "../../../../scripts/lib/occ-publish.mjs";

export const runtime = "nodejs";

const handlePublish = createPublishHandler();

export const POST = handlePublish;
export const GET = handlePublish;
export const HEAD = handlePublish;
export const OPTIONS = handlePublish;
export const PUT = handlePublish;
export const PATCH = handlePublish;
export const DELETE = handlePublish;
