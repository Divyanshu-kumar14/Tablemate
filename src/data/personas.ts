import type { Needs, TasteSeed } from "@/types/domain";

export interface Persona {
  id: "p1" | "p2" | "p3";
  name: string;
  age: number;
  relationship: string;
  blurb: string;
  location: string;
  taste: TasteSeed[];
  needs: Needs;
}

export const PERSONAS: Persona[] = [
  {
    id: "p1",
    name: "Sylvia",
    age: 78,
    relationship: "Lives alone in Brooklyn",
    blurb: "Dysphagia, lower-sodium diet, hearing aids, and a walker. She sticks to two familiar places.",
    location: "Brooklyn, NY",
    taste: [
      { name: "Miles Davis", type: "artist", qlooId: "mock:artist:miles-davis" },
      { name: "Casablanca", type: "movie", qlooId: "mock:movie:casablanca" },
      { name: "Italian", type: "cuisine", qlooId: "urn:tag:genre:place:italian" },
    ],
    needs: {
      texture: "soft",
      sodium: "lower",
      diet: ["diabetic-friendly"],
      noise: "quiet",
      mobility: ["step-free"],
    },
  },
  {
    id: "p2",
    name: "Raj",
    age: 74,
    relationship: "Lives with his daughter in Edison",
    blurb: "Type 2 diabetes, no texture restriction, and he prefers a room with some life in it.",
    location: "Edison, NJ",
    taste: [
      { name: "Ravi Shankar", type: "artist", qlooId: "mock:artist:ravi-shankar" },
      { name: "Pather Panchali", type: "movie", qlooId: "mock:movie:pather-panchali" },
      { name: "Indian", type: "cuisine", qlooId: "urn:tag:genre:place:indian" },
    ],
    needs: {
      texture: "regular",
      sodium: "no-preference",
      diet: ["diabetic-friendly"],
      noise: "moderate",
      mobility: [],
    },
  },
  {
    id: "p3",
    name: "Margaret",
    age: 81,
    relationship: "Lives in Chicago near her son",
    blurb: "Pureed textures, a wheelchair, and a strong preference for a quiet room.",
    location: "Chicago, IL",
    taste: [
      { name: "Frank Sinatra", type: "artist", qlooId: "mock:artist:frank-sinatra" },
      { name: "The Sound of Music", type: "movie", qlooId: "mock:movie:sound-of-music" },
      { name: "American", type: "cuisine", qlooId: "urn:tag:genre:place:american" },
    ],
    needs: {
      texture: "very-soft",
      sodium: "lower",
      diet: [],
      noise: "quiet",
      mobility: ["wheelchair"],
    },
  },
];

export function getPersona(id: string | null | undefined): Persona | null {
  return PERSONAS.find((persona) => persona.id === id) ?? null;
}
