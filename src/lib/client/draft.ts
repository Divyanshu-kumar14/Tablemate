"use client";

import { recommendRequestSchema, type RecommendRequest } from "@/lib/schemas";

const STORAGE_KEY = "tablemate:draft:v1";

export function saveDraft(draft: RecommendRequest) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Session storage can be unavailable; the form still works.
  }
}

export function loadDraft(): RecommendRequest | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = recommendRequestSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
