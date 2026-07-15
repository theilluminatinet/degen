export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "Washington D.C." },
] as const;

export type StateCode = typeof US_STATES[number]["code"];

export function getStateName(code: string): string {
  const state = US_STATES.find((s) => s.code === code);
  return state?.name || code;
}

export function getBannedStatesArray(bannedStates: string | null): string[] {
  if (!bannedStates) return [];
  return bannedStates.split(",").map((s) => s.trim()).filter(Boolean);
}

export function isLegalInState(bannedStates: string | null, stateCode: string): boolean {
  if (!bannedStates || !stateCode) return true;
  const banned = getBannedStatesArray(bannedStates);
  return !banned.includes(stateCode.toUpperCase());
}

// Common banned state presets
export const COMMON_BANNED_PRESETS = {
  standard: ["WA", "ID", "MI", "NV", "MT", "CT", "NJ", "NY", "CA"],
  strict: ["WA", "ID", "MI", "NV", "MT", "CT", "NJ", "NY", "CA", "IN", "LA", "KY", "MD", "TN", "WV"],
  moderate: ["WA", "ID", "MI", "NV"],
} as const;
