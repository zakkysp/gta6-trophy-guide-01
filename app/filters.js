// Filtering rules for the checklist. One job: decide which trophies a filter shows.
// Kinds: story, missable, collectibles, activities, online (the game lists none).
// The spoiler rule hides a story trophy's name, description and guide until earned.
export function isStoryTrophy(trophy) {
  return trophy.kind === 'story';
}

export function trophyMatches(trophy, filters, earned) {
  if (filters.kind === 'story' && trophy.kind !== 'story') return false;
  if (filters.kind === 'missable' && !trophy.missable) return false;
  if (filters.kind === 'collectibles' && trophy.kind !== 'collectibles') return false;
  if (filters.kind === 'activities' && trophy.kind !== 'activities') return false;
  if (filters.kind === 'online' && trophy.kind !== 'online') return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.query) {
    const q = filters.query.toLowerCase();
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

// True when the spoiler setting must hide this trophy's details.
export function isSpoilerHidden(trophy, settings, earned) {
  return settings.spoiler === true && isStoryTrophy(trophy) && !earned.has(trophy.name);
}
