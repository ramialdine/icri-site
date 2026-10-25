import { describe, expect, it, vi } from "vitest";

const { commit, inc, createIfNotExists, patch } = vi.hoisted(() => ({
  commit: vi.fn(),
  inc: vi.fn(),
  createIfNotExists: vi.fn(),
  patch: vi.fn(),
}));

vi.mock("@/sanity/lib/writeClient", () => {
  const transaction = {
    createIfNotExists: (doc: unknown) => {
      createIfNotExists(doc);
      return transaction;
    },
    patch: (id: string, fn: (p: { inc: typeof inc }) => unknown) => {
      patch(id);
      fn({ inc });
      return transaction;
    },
    commit,
  };
  return { sanityWriteClient: { transaction: () => transaction, fetch: vi.fn() } };
});

import { isCountableClick, isDonationMethod, recordDonationClick } from "./clicks";

function request(headers: Record<string, string>, method = "GET") {
  return new Request("https://masjid-alkareem.org/go/mohid", { method, headers });
}

describe("isDonationMethod", () => {
  it("accepts only known methods", () => {
    expect(isDonationMethod("mohid")).toBe(true);
    expect(isDonationMethod("paypal")).toBe(true);
    expect(isDonationMethod("zelle")).toBe(false);
    expect(isDonationMethod("toString")).toBe(false);
  });
});

describe("isCountableClick", () => {
  const browser = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1";

  it("counts a normal browser click", () => {
    expect(isCountableClick(request({ "user-agent": browser }))).toBe(true);
  });

  it("ignores crawlers, link previews, prefetches and non-GET requests", () => {
    expect(isCountableClick(request({ "user-agent": "Googlebot/2.1" }))).toBe(false);
    expect(isCountableClick(request({ "user-agent": "WhatsApp/2.23 (link preview)" }))).toBe(false);
    expect(isCountableClick(request({ "user-agent": browser, purpose: "prefetch" }))).toBe(false);
    expect(isCountableClick(request({ "user-agent": browser }, "HEAD"))).toBe(false);
    expect(isCountableClick(request({}))).toBe(false);
  });
});

describe("recordDonationClick", () => {
  it("increments one document per method per masjid day", async () => {
    // 03:00 UTC on Oct 25 is still Oct 24 evening in Rhode Island.
    await recordDonationClick("paypal", new Date("2026-10-25T03:00:00Z"));

    expect(createIfNotExists).toHaveBeenCalledWith({
      _id: "donateclick.paypal.2026-10-24",
      _type: "donateClick",
      method: "paypal",
      date: "2026-10-24",
      count: 0,
    });
    expect(patch).toHaveBeenCalledWith("donateclick.paypal.2026-10-24");
    expect(inc).toHaveBeenCalledWith({ count: 1 });
    expect(commit).toHaveBeenCalled();
  });
});
