export type ProgrammeActivityId =
  | "badminton"
  | "yoga"
  | "basket"
  | "velo"
  | "natation";

export type ProgrammeFilterId =
  | "all"
  | "morning"
  | "afternoon"
  | "evening"
  | "beginner"
  | "handisport"
  | "family";

export type ProgrammeActivity = {
  id: ProgrammeActivityId;
  time: string;
  timeRange: string;
  title: string;
  place: string;
  badge: string;
  badgeColor: string;
  tags: ProgrammeFilterId[];
};

export const programmeFilters: Array<{ id: ProgrammeFilterId; label: string }> = [
  { id: "all", label: "Tout" },
  { id: "morning", label: "Matin" },
  { id: "afternoon", label: "Apres-midi" },
  { id: "evening", label: "Soir" },
  { id: "beginner", label: "Debutants" },
  { id: "handisport", label: "Handisport" },
  { id: "family", label: "Famille" },
];

export const programmeActivities: ProgrammeActivity[] = [
  {
    id: "badminton",
    time: "10h00",
    timeRange: "10h00 - 11h00",
    title: "Badminton decouverte",
    place: "Club Elan Nord - Terrain B",
    badge: "Debutants bienvenus",
    badgeColor: "bg-[#0558f6]",
    tags: ["morning", "beginner"],
  },
  {
    id: "yoga",
    time: "11h30",
    timeRange: "11h30 - 12h30",
    title: "Yoga & mobilite",
    place: "Zen Ensemble - Espace vert",
    badge: "Tous niveaux",
    badgeColor: "bg-[#05ad56]",
    tags: ["morning"],
  },
  {
    id: "basket",
    time: "14h00",
    timeRange: "14h00 - 15h30",
    title: "Basket initiation",
    place: "Gym Quartier Libre - Salle couverte",
    badge: "Initiation",
    badgeColor: "bg-[#ff5c29]",
    tags: ["afternoon", "beginner"],
  },
  {
    id: "velo",
    time: "15h30",
    timeRange: "15h30 - 16h30",
    title: "Velo adapte",
    place: "Roues pour Tous - Allee principale",
    badge: "Handisport",
    badgeColor: "bg-[#7f00b1]",
    tags: ["afternoon", "handisport"],
  },
  {
    id: "natation",
    time: "16h00",
    timeRange: "16h00 - 17h00",
    title: "Natation libre",
    place: "Aqua Solidaire - Piscine",
    badge: "Famille",
    badgeColor: "bg-[#ff8da4]",
    tags: ["evening", "family"],
  },
];

export const defaultProgrammeActivityIds: ProgrammeActivityId[] = ["badminton", "yoga"];

const programmeActivityIdSet = new Set<ProgrammeActivityId>(
  programmeActivities.map((activity) => activity.id),
);

const programmeActivityMap = new Map<ProgrammeActivityId, ProgrammeActivity>(
  programmeActivities.map((activity) => [activity.id, activity]),
);

export function isProgrammeActivityId(value: string): value is ProgrammeActivityId {
  return programmeActivityIdSet.has(value as ProgrammeActivityId);
}

export function normalizeProgrammeActivityIds(ids: Iterable<string>): ProgrammeActivityId[] {
  const picked = new Set<ProgrammeActivityId>();

  for (const id of ids) {
    if (isProgrammeActivityId(id)) {
      picked.add(id);
    }
  }

  return programmeActivities
    .map((activity) => activity.id)
    .filter((activityId) => picked.has(activityId));
}

export function getProgrammeActivityById(id: string): ProgrammeActivity | null {
  if (!isProgrammeActivityId(id)) {
    return null;
  }
  return programmeActivityMap.get(id) ?? null;
}
