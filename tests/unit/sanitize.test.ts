import { describe, expect, it } from "vitest";
import {
  findForbiddenClaims,
  hasForbiddenClaim,
  sanitizeCopy,
} from "@/lib/sanitize";

describe("sanitizeCopy", () => {
  it("finds every forbidden verification claim", () => {
    expect(findForbiddenClaims("This is safe, guaranteed, and verified.")).toEqual([
      "safe",
      "guaranteed",
      "verified",
    ]);
    expect(findForbiddenClaims("COMPLIANT and APPROVED and CERTIFIED")).toEqual([
      "compliant",
      "approved",
      "certified",
    ]);
  });

  it("does not over-match words that contain a forbidden stem", () => {
    expect(hasForbiddenClaim("Safety is not a claim we make.")).toBe(false);
    expect(hasForbiddenClaim("unsafe")).toBe(false);
    expect(hasForbiddenClaim("safeguard")).toBe(false);
  });

  it("matches claims case-insensitively and with punctuation", () => {
    expect(hasForbiddenClaim("SAFE.")).toBe(true);
    expect(hasForbiddenClaim("(verified)")).toBe(true);
    expect(hasForbiddenClaim("safely")).toBe(true);
  });

  it("returns the fallback when generated copy makes a claim", () => {
    expect(sanitizeCopy("This restaurant is safe.", "Template reason.")).toBe(
      "Template reason.",
    );
  });

  it("leaves honest copy untouched", () => {
    const copy = "Gluten-free options are often available; confirm preparation.";
    expect(sanitizeCopy(copy, "Template reason.")).toBe(copy);
  });

  it("handles empty text", () => {
    expect(findForbiddenClaims("")).toEqual([]);
    expect(hasForbiddenClaim("")).toBe(false);
  });
});
