import {
  defaultProgrammeActivityIds,
  normalizeProgrammeActivityIds,
  type ProgrammeActivityId,
} from "@/lib/programme-data";

const PROGRAMME_SELECTION_STORAGE_KEY = "solimouv.programme.selectedActivities";

export function parseProgrammeSelectionParam(rawValue: string | null) {
  if (!rawValue) {
    return [];
  }

  const ids = rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return normalizeProgrammeActivityIds(ids);
}

export function buildProgrammeSelectionParam(ids: Iterable<string>) {
  return normalizeProgrammeActivityIds(ids).join(",");
}

export function readProgrammeSelectionFromStorage(): ProgrammeActivityId[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(PROGRAMME_SELECTION_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return normalizeProgrammeActivityIds(parsed.map((value) => String(value)));
  } catch {
    return [];
  }
}

export function writeProgrammeSelectionToStorage(ids: Iterable<string>) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeProgrammeActivityIds(ids);
  window.localStorage.setItem(PROGRAMME_SELECTION_STORAGE_KEY, JSON.stringify(normalized));
}

export function resolveProgrammeSelection(rawValue: string | null): ProgrammeActivityId[] {
  const fromQuery = parseProgrammeSelectionParam(rawValue);
  if (fromQuery.length > 0) {
    return fromQuery;
  }

  const fromStorage = readProgrammeSelectionFromStorage();
  if (fromStorage.length > 0) {
    return fromStorage;
  }

  return defaultProgrammeActivityIds;
}
