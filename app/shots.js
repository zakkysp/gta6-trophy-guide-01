// Deterministic staging for screenshots: ?shot=<name> picks a view and seeds
// progress in memory only (nothing is written to localStorage by a shot).
//   ?shot=checklist — the full list, 13 trophies earned, spoilers off
//   ?shot=roadmap  — the Roadmap to Platinum view
//   ?shot=guide    — a trophy's guide and sources open beside the list
//   ?shot=spoiler  — spoiler mode on: story trophies hidden until earned
const SEED_EARNED = [
  'Just Like Paradise', 'Paradise Lost', 'Trust', 'Break the Bank',
  'Master of None', 'Baited My Tackle', 'Stick Fiddler', 'Whip It Good',
  'The Goodtime State', 'Treat Yo Self', 'Little Boxes', 'On the Spot',
  'Dime on the Dollar',
];

export function shotFromUrl() {
  return new URLSearchParams(window.location.search).get('shot');
}

// Applies a shot to the in-memory state. Returns the view to show and,
// for the guide shot, the trophy to open in the detail pane.
export function applyShot(trophies, state) {
  const shot = shotFromUrl();
  if (!shot) return { view: 'checklist', open: null };
  if (shot === 'roadmap') {
    state.earned = new Set(SEED_EARNED);
    return { view: 'roadmap', open: null };
  }
  if (shot === 'spoiler') {
    state.settings.spoiler = true;
    state.earned = new Set(SEED_EARNED);
    return { view: 'checklist', open: null };
  }
  if (shot === 'guide') {
    state.earned = new Set(SEED_EARNED);
    const open = trophies.find((t) => t.name === 'Positive Mental Attitude') ?? null;
    return { view: 'checklist', open };
  }
  // Default: checklist with seeded progress.
  state.earned = new Set(SEED_EARNED);
  return { view: 'checklist', open: null };
}
