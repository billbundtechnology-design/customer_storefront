export type ListingKind = "rental" | "venue" | "planning";

export interface Listing {
  id: string;
  name: string;
  category: string;
  kind: ListingKind;
  price: number;
  unit: string;
  description: string;
  visual: string;
  popular?: boolean;
  capacity?: number;
}

export const catalog: Listing[] = [
  { id: "rental-chair", name: "Gold Chiavari chairs", category: "Seating", kind: "rental", price: 2500, unit: "per chair", description: "A timeless seat for the moments worth celebrating.", visual: "chairs", popular: true },
  { id: "rental-table", name: "Round banquet table", category: "Tables", kind: "rental", price: 12000, unit: "per table", description: "Room for your people, beautifully set.", visual: "tables", popular: true },
  { id: "rental-sound", name: "Sound & microphone set", category: "Audio", kind: "rental", price: 95000, unit: "per event", description: "Clear sound from the first toast to the last song.", visual: "sound", popular: true },
  { id: "rental-canopy", name: "Garden canopy", category: "Shelter", kind: "rental", price: 85000, unit: "per canopy", description: "A little shade for a lot of good memories.", visual: "canopy", popular: true },
  { id: "rental-lounge", name: "Velvet lounge set", category: "Lounge", kind: "rental", price: 65000, unit: "per set", description: "A cosy corner made for long conversations.", visual: "lounge" },
  { id: "rental-lights", name: "Warm uplighting set", category: "Lighting", kind: "rental", price: 48000, unit: "per set", description: "Give your evening that just-right glow.", visual: "lights" },
  { id: "rental-linen", name: "Ivory table linen", category: "Tableware", kind: "rental", price: 4500, unit: "per table", description: "The finishing touch to a thoughtful table.", visual: "linen" },
  { id: "rental-dance", name: "Dance floor", category: "Staging", kind: "rental", price: 180000, unit: "per event", description: "A polished floor for your favourite people.", visual: "dance" },
  { id: "venue-courtyard", name: "The Courtyard", category: "Garden venue", kind: "venue", price: 280000, unit: "full day", description: "A leafy garden escape for up to 80 guests.", visual: "courtyard", popular: true, capacity: 80 },
  { id: "venue-nook", name: "The Nook", category: "Private venue", kind: "venue", price: 160000, unit: "half day", description: "An intimate hideaway for up to 35 guests.", visual: "nook", popular: true, capacity: 35 },
  { id: "venue-studio", name: "The Garden Studio", category: "Private venue", kind: "venue", price: 130000, unit: "half day", description: "A light-filled little space for up to 24 guests.", visual: "nook", capacity: 24 },
  { id: "venue-oak", name: "Grand Oak Hall", category: "Event hall", kind: "venue", price: 450000, unit: "full day", description: "A graceful gathering place for up to 120 guests.", visual: "oak", capacity: 120 },
  { id: "planning-styling", name: "The thoughtful celebration", category: "Planning", kind: "planning", price: 450000, unit: "starting from", description: "A little help making all the details feel like you.", visual: "planning", popular: true }
];

export const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
