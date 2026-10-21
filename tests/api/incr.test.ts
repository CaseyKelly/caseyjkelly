// Lives outside pages/: Next serves every file there as a route, tests included.
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const redis = vi.hoisted(() => ({
  set: vi.fn(),
  incr: vi.fn(),
}));

vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: () => redis },
}));

import incr from "@/pages/api/incr";

function request(
  init: {
    method?: string;
    body?: unknown;
    contentType?: string | null;
    ip?: string;
  } = {},
): NextRequest {
  const { method = "POST", body, contentType = "application/json", ip } = init;
  const headers = new Headers();
  if (contentType) headers.set("Content-Type", contentType);
  return new NextRequest("https://caseyjkelly.com/api/incr", {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    ip,
  } as ConstructorParameters<typeof NextRequest>[1]);
}

describe("POST /api/incr", () => {
  beforeEach(() => {
    redis.set.mockReset().mockResolvedValue("OK");
    redis.incr.mockReset().mockResolvedValue(1);
  });

  it("rejects methods other than POST", async () => {
    const res = await incr(request({ method: "GET", contentType: null }));

    expect(res.status).toBe(405);
    expect(await res.text()).toBe("use POST");
    expect(redis.incr).not.toHaveBeenCalled();
  });

  it("rejects bodies that are not JSON", async () => {
    const res = await incr(
      request({ body: { slug: "fantasyphish" }, contentType: "text/plain" }),
    );

    expect(res.status).toBe(400);
    expect(await res.text()).toBe("must be json");
    expect(redis.incr).not.toHaveBeenCalled();
  });

  it.each([
    ["no slug", {}],
    ["an empty slug", { slug: "" }],
  ])("rejects a body with %s", async (_, body) => {
    const res = await incr(request({ body }));

    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Slug not found");
    expect(redis.incr).not.toHaveBeenCalled();
  });

  it("counts a view when the request has no IP", async () => {
    const res = await incr(request({ body: { slug: "fantasyphish" } }));

    expect(res.status).toBe(202);
    expect(redis.set).not.toHaveBeenCalled();
    expect(redis.incr).toHaveBeenCalledWith("pageviews:projects:fantasyphish");
  });

  it("counts the first view from an IP and stores only a hash of it", async () => {
    const res = await incr(
      request({ body: { slug: "fantasyphish" }, ip: "203.0.113.7" }),
    );

    expect(res.status).toBe(202);
    expect(redis.set).toHaveBeenCalledTimes(1);
    const [key, value, options] = redis.set.mock.calls[0];
    expect(key).toMatch(/^deduplicate:[0-9a-f]{64}:fantasyphish$/);
    expect(key).not.toContain("203.0.113.7");
    expect(value).toBe(true);
    expect(options).toEqual({ nx: true, ex: 24 * 60 * 60 });
    expect(redis.incr).toHaveBeenCalledWith("pageviews:projects:fantasyphish");
  });

  it("hashes the same IP to the same key", async () => {
    await incr(request({ body: { slug: "a" }, ip: "203.0.113.7" }));
    await incr(request({ body: { slug: "a" }, ip: "203.0.113.7" }));
    await incr(request({ body: { slug: "a" }, ip: "198.51.100.1" }));

    const keys = redis.set.mock.calls.map(([key]) => key);
    expect(keys[0]).toBe(keys[1]);
    expect(keys[2]).not.toBe(keys[0]);
  });

  it("does not count a repeat view from the same IP within a day", async () => {
    // SET NX returns null when the key already exists
    redis.set.mockResolvedValue(null);

    const res = await incr(
      request({ body: { slug: "fantasyphish" }, ip: "203.0.113.7" }),
    );

    expect(res.status).toBe(202);
    expect(redis.incr).not.toHaveBeenCalled();
  });
});
