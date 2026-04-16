export type FestivalStand = {
  id: string;
  name: string;
  activity: string;
  location: string;
};

export const FESTIVAL_STANDS: FestivalStand[] = [
  {
    id: "basket-inclusif",
    name: "Basket inclusif",
    activity: "Initiation collective",
    location: "Zone A",
  },
  {
    id: "football-solidaire",
    name: "Football solidaire",
    activity: "Ateliers techniques",
    location: "Zone B",
  },
  {
    id: "danse-urbaine",
    name: "Danse urbaine",
    activity: "Session rythme et expression",
    location: "Scene centrale",
  },
  {
    id: "yoga-bien-etre",
    name: "Yoga bien-etre",
    activity: "Mobilite et respiration",
    location: "Espace zen",
  },
  {
    id: "boxe-educative",
    name: "Boxe educative",
    activity: "Coordination et confiance",
    location: "Zone C",
  },
  {
    id: "premiers-secours",
    name: "Premiers secours",
    activity: "Gestes qui sauvent",
    location: "Atelier prevention",
  },
];

export function getStandById(id: string) {
  return FESTIVAL_STANDS.find((stand) => stand.id === id);
}
