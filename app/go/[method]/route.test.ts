import { describe, expect, it, vi } from "vitest";

import { recordDonationClick } from "@/lib/donations/clicks";

import { GET } from "./route";

vi.mock("@/lib/donations/clicks", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/donations/clicks")>()),
  recordDonationClick: vi.fn(),
}));

const BROWSER = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36";

function call(method: string, headers: Record<string, string> = { "user-agent": BROWSER }) {
  return GET(new Request(`https://masjid-alkareem.org/go/${method}`, { headers }), {
    params: Promise.resolve({ method }),
  });
}

describe("GET /go/[method]", () => {
  it("counts the click and redirects to Mohid", async () => {
    const response = await call("mohid");

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("https://us.mohid.co/ri/providence/icri/masjid/online/donation");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(recordDonationClick).toHaveBeenCalledWith("mohid");
  });

  it("counts the click and redirects to PayPal", async () => {
    const response = await call("paypal");

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toContain("paypal.com/donate");
    expect(recordDonationClick).toHaveBeenCalledWith("paypal");
  });

  it("redirects without counting bots", async () => {
    vi.mocked(recordDonationClick).mockClear();
    const response = await call("mohid", { "user-agent": "Googlebot/2.1" });

    expect(response.status).toBe(302);
    expect(recordDonationClick).not.toHaveBeenCalled();
  });

  it("still redirects when the counter fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(recordDonationClick).mockRejectedValueOnce(new Error("sanity down"));

    const response = await call("paypal");

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toContain("paypal.com/donate");
  });

  it("returns 404 for unknown methods", async () => {
    const response = await call("zelle");

    expect(response.status).toBe(404);
  });
});
