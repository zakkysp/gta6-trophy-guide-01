// Progress and settings, kept in the browser only (localStorage).
// One job: read, write, export and import the earned set and the settings.
const PROGRESS_KEY = 'leonida-trophy-guide.progress.v1';
const SETTINGS_KEY = 'leonida-trophy-guide.settings.v1';

export function loadProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]');
    return new Set(Array.isArray(raw) ? raw.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveProgress(earned) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earned]));
}

export function loadSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}');
    return { spoiler: raw.spoiler === true, kind: typeof raw.kind === 'string' ? raw.kind : 'all', grade: typeof raw.grade === 'string' ? raw.grade : 'all' };
  } catch {
    return { spoiler: false, kind: 'all', grade: 'all' };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Export: a JSON file the reader can keep or move to another browser.
export function exportProgress(earned, settings) {
  const payload = {
    app: 'leonida-trophy-guide',
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...earned],
    settings,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

// Import: read a file back, keep only names that exist in the trophy list.
export async function importProgress(file, knownNames) {
  const text = await file.text();
  const data = JSON.parse(text);
  const names = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(names)) throw new Error('not a progress file');
  const known = new Set(knownNames);
  const earned = new Set(names.filter((n) => typeof n === 'string' && known.has(n)));
  const settings = data && typeof data.settings === 'object' && data.settings !== null ? data.settings : null;
  return { earned, settings };
}
