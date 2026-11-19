// Boot: load the data, wire the controls, render the views.
import { loadTrophies } from './data.js';
import { loadProgress, saveProgress, loadSettings, saveSettings, exportProgress, importProgress } from './store.js';
import { renderProgress, renderChecklist, renderDetail, closeDetail, renderRoadmap, renderMissables, renderSources } from './views.js';
import { applyShot } from './shots.js';

const SOURCES = [
  { name: 'PowerPyx — GTA 6 Trophy Guide & Roadmap', url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/', note: 'the full roadmap, missable warning and per-trophy steps used for most guides here' },
  { name: 'Exophase — GTA VI trophy list', url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/', note: 'the official 55 names, descriptions and grades' },
  { name: 'PSNProfiles — GTA VI trophies', url: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi', note: 'grades and the tracked counts PSN shows for each trophy' },
  { name: 'GTABase — GTA 6 Trophy Guide & Achievements List', url: 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series', note: 'corroborates the missable warning and the cheat warning' },
];

const trophies = await loadTrophies();
const state = {
  earned: loadProgress(),
  settings: loadSettings(),
  query: '',
  view: 'checklist',
};

const shot = applyShot(trophies, state);
state.view = shot.view;

function filters() {
  return { kind: state.settings.kind, grade: state.settings.grade, query: state.query };
}

function renderAll() {
  renderProgress(trophies, state.earned);
  renderChecklist(trophies, state.earned, filters(), state.settings,
    (name, checked) => {
      if (checked) state.earned.add(name);
      else state.earned.delete(name);
      saveProgress(state.earned);
      renderAll();
    },
    (t) => renderDetail(t, state.earned));
  renderRoadmap(trophies, state.earned, state.settings, (t) => renderDetail(t, state.earned));
  renderMissables(trophies, (t) => renderDetail(t, state.earned));
  renderSources(SOURCES);
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === state.view);
  });
  for (const id of ['checklist', 'roadmap', 'missables', 'about']) {
    document.getElementById(`view-${id}`).hidden = state.view !== id;
  }
  document.getElementById('toolbar').style.display = state.view === 'checklist' ? '' : 'none';
}

// Tabs.
document.getElementById('tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-view]');
  if (!btn) return;
  state.view = btn.dataset.view;
  renderAll();
});

// Kind filters.
document.getElementById('kindFilters').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-kind]');
  if (!btn) return;
  state.settings.kind = btn.dataset.kind;
  saveSettings(state.settings);
  document.querySelectorAll('#kindFilters button').forEach((b) => {
    b.classList.toggle('active', b === btn);
  });
  renderAll();
});

// Grade filter.
const gradeSelect = document.getElementById('grade');
gradeSelect.value = state.settings.grade;
gradeSelect.addEventListener('change', () => {
  state.settings.grade = gradeSelect.value;
  saveSettings(state.settings);
  renderAll();
});

// Search.
document.getElementById('search').addEventListener('input', (e) => {
  state.query = e.target.value.trim();
  renderAll();
});

// Spoiler setting.
const spoilerBox = document.getElementById('spoiler');
spoilerBox.checked = state.settings.spoiler;
spoilerBox.addEventListener('change', () => {
  state.settings.spoiler = spoilerBox.checked;
  saveSettings(state.settings);
  renderAll();
});

// Export and import.
document.getElementById('export').addEventListener('click', () => {
  exportProgress(state.earned, state.settings);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const { earned, settings } = await importProgress(file, trophies.map((t) => t.name));
    state.earned = earned;
    if (settings) {
      state.settings = { ...state.settings, ...settings };
      gradeSelect.value = state.settings.grade;
      spoilerBox.checked = state.settings.spoiler;
    }
    saveProgress(state.earned);
    saveSettings(state.settings);
    renderAll();
  } catch {
    window.alert('That file is not a trophy progress export from this guide.');
  }
  e.target.value = '';
});

document.getElementById('detailClose').addEventListener('click', closeDetail);

// Restore the saved kind filter button.
document.querySelectorAll('#kindFilters button').forEach((b) => {
  b.classList.toggle('active', b.dataset.kind === state.settings.kind);
});

renderAll();
if (shot.open) renderDetail(shot.open, state.earned);
