// Loads the trophy data file. One job: fetch and parse app/data/trophies.json.
export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('could not load data/trophies.json');
  const doc = await response.json();
  if (!Array.isArray(doc.trophies)) throw new Error('trophies.json has no trophies array');
  return doc.trophies;
}
