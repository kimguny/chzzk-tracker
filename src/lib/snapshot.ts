import { SavedSnapshot } from "@/types/chzzk";

const STORAGE_KEY = "chzzk_snapshot";

export function loadSnapshot(): SavedSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedSnapshot) : null;
  } catch {
    return null;
  }
}

export function saveSnapshot(snapshot: SavedSnapshot): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function detectUnfollowers(
  prev: SavedSnapshot,
  currentMutualFollows: string[]
): string[] {
  const currentSet = new Set(currentMutualFollows);
  return prev.mutualFollows.filter((name) => !currentSet.has(name));
}
