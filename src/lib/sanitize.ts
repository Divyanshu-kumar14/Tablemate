/**
 * Health copy is safety copy. These words imply a verification we do not have.
 * Any generated text containing them is replaced with a deterministic template.
 */
const FORBIDDEN_PATTERN = /\b(safe|safely|guaranteed|compliant|approved|verified|certified)\b/gi;

export function findForbiddenClaims(text: string): string[] {
  return [...text.matchAll(FORBIDDEN_PATTERN)].map((match) => match[0].toLowerCase());
}

export function hasForbiddenClaim(text: string): boolean {
  return findForbiddenClaims(text).length > 0;
}

export function sanitizeCopy(text: string, fallback: string): string {
  return hasForbiddenClaim(text) ? fallback : text;
}
