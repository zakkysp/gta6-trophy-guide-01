// Rendering for every view. One job: turn trophy data + state into DOM.
import { trophyMatches, isSpoilerHidden } from './filters.js';

const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const KIND_LABEL = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online', platinum: 'Platinum' };

export function renderProgress(trophies, earned) {
  document.getElementById('earnedCount').textContent = String(earned.size);
  const fill = document.getElementById('progressFill');
  fill.style.width = `${(earned.size / trophies.length) * 100}%`;
  const byGrade = {};
  for (const t of trophies) if (earned.has(t.name)) byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const total = trophies.filter((t) => t.grade === g).length;
    return `${GRADE_LABEL[g]} ${byGrade[g] ?? 0}/${total}`;
  });
  document.getElementById('gradeCounts').textContent = parts.join(' · ');
}

export function renderChecklist(trophies, earned, filters, settings, onToggle, onOpen) {
  const list = document.getElementById('trophyList');
  list.replaceChildren();
  const shown = trophies.filter((t) => trophyMatches(t, filters, earned));
  document.getElementById('emptyNote').hidden = shown.length > 0;
  const intro = document.getElementById('listIntro');
  intro.textContent = filters.kind === 'online'
    ? 'GTA VI lists no online trophies — the whole list is single-player. This filter is here so you can check that for yourself.'
    : `${shown.length} of ${trophies.length} trophies shown. Click a trophy's Guide button for its steps and sources.`;
  for (const t of shown) {
    const li = document.createElement('li');
    li.className = `trophy-row${earned.has(t.name) ? ' earned' : ''}`;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => onToggle(t.name, box.checked));
    const body = document.createElement('div');
    const hidden = isSpoilerHidden(t, settings, earned);
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = hidden ? 'Hidden story trophy' : t.name;
    const desc = document.createElement('div');
    desc.className = hidden ? 'trophy-desc spoiler-hidden' : 'trophy-desc';
    desc.textContent = hidden ? 'Hidden until earned — turn the spoiler setting off to reveal it.' : t.description;
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    const grade = document.createElement('span');
    grade.className = `pill ${t.grade}`;
    grade.textContent = GRADE_LABEL[t.grade];
    meta.append(grade);
    const kind = document.createElement('span');
    kind.className = 'pill kind';
    kind.textContent = KIND_LABEL[t.kind] ?? t.kind;
    meta.append(kind);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'pill missable';
      m.textContent = '⚠ Possibly missable';
      meta.append(m);
    }
    if (t.target) {
      const target = document.createElement('span');
      target.className = 'pill';
      target.textContent = `Target: ${t.target}`;
      meta.append(target);
    }
    body.append(name, desc, meta);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-btn';
    btn.textContent = hidden ? 'Reveal when earned' : 'Guide';
    btn.disabled = hidden;
    btn.addEventListener('click', () => onOpen(t));
    li.append(box, body, btn);
    list.append(li);
  }
}

export function renderDetail(trophy, earned) {
  const body = document.getElementById('detailBody');
  body.replaceChildren();
  const title = document.createElement('h2');
  title.textContent = trophy.name;
  const meta = document.createElement('p');
  meta.textContent = `${GRADE_LABEL[trophy.grade]} · ${KIND_LABEL[trophy.kind] ?? trophy.kind}${trophy.missable ? ' · Possibly missable' : ''}`;
  const desc = document.createElement('p');
  desc.textContent = trophy.description;
  body.append(title, meta, desc);
  if (trophy.target) {
    const target = document.createElement('p');
    target.innerHTML = '';
    target.textContent = `Target: ${trophy.target}`;
    body.append(target);
  }
  if (trophy.missable) {
    const warn = document.createElement('p');
    warn.className = 'warn';
    warn.textContent = 'Possibly missable: the first meditation can only be done in Chapter 1 at Jason’s house, and it is gone after that chapter. Do it the morning after the “Down to Earth” mission — talk to Lucia in the kitchen, follow her to the balcony and choose “Accept”. Whether it counts toward the trophy is still unconfirmed, so doing it is the safe choice.';
    body.append(warn);
  }
  const guideHead = document.createElement('h3');
  guideHead.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = trophy.guide;
  body.append(guideHead, guide);
  if (trophy.unverified) {
    const note = document.createElement('p');
    note.className = 'unverified';
    note.textContent = 'Not yet verified: no launch guide has confirmed the exact trigger for this trophy. This guide does not invent one — check the sources below for updates.';
    body.append(note);
  }
  const srcHead = document.createElement('h3');
  srcHead.textContent = 'Sources';
  const list = document.createElement('ul');
  list.className = 'source-list';
  for (const s of trophy.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a);
    list.append(li);
  }
  body.append(srcHead, list);
  const state = document.createElement('p');
  state.textContent = earned.has(trophy.name) ? '✓ You have marked this trophy as earned.' : 'Not earned yet — tick its box in the checklist when you unlock it.';
  body.append(state);
  document.getElementById('detail').hidden = false;
}

export function closeDetail() {
  document.getElementById('detail').hidden = true;
}

const ROADMAP = [
  {
    title: 'Stage 1 — Play the story (Chapters 1–5)',
    text: 'Just play. Every chapter and mission trophy unlocks automatically as you finish the story, and progress toward the 100% checklist already counts. Do the Chapter 1 balcony meditation for Positive Mental Attitude — it is the only step that can disappear.',
    stage: 1,
  },
  {
    title: 'Stage 2 — Character questlines (Andy, Kenton, Billy, Randy, Tyrone, Bret)',
    text: 'Each friend has a questline that ends in a trophy. They all stay available after the story, so none of them can be missed — but each one is a chain of several quests, so start them as they appear.',
    stage: 2,
  },
  {
    title: 'Stage 3 — The 100% completion checklist',
    text: 'After the story, the checklist opens under Progress > Stats > 100% Completion. It is closer to 60% true completion: 100 optional missions (of 200–300+), 200 of 277 vehicles scanned, 100 of 255 animals studied, 70 of 80 challenges, and every robbery, shooting range, drone race and Bret quest. This stage is the longest — about 100 hours.',
    stage: 3,
  },
  {
    title: 'Stage 4 — Strangers & Freaks and cleanup',
    text: 'Eight stranger strands count toward their trophy (Kirk, Kyle, Yago, Pilot Pete and more). Then sweep up the remaining one-offs: the plane at VCIA, the tank at Mile Zero, the blue Banshee showroom, the bowling alley, the 500 criminal-profile actions and the money trophies.',
    stage: 4,
  },
  {
    title: 'Stage 5 — Platinum',
    text: 'Vice Got a Price! unlocks the moment the other 54 are done. No multiplayer, no DLC, no second playthrough required.',
    stage: 5,
  },
];

export function renderRoadmap(trophies, earned, settings, onOpen) {
  const wrap = document.getElementById('roadmapStages');
  wrap.replaceChildren();
  for (const stage of ROADMAP) {
    const div = document.createElement('div');
    div.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = stage.title;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const ol = document.createElement('ol');
    for (const t of trophies.filter((x) => x.stage === stage.stage)) {
      const li = document.createElement('li');
      const hidden = settings.spoiler === true && t.kind === 'story' && !earned.has(t.name);
      const chip = document.createElement('span');
      chip.className = 'trophy-chip';
      chip.textContent = hidden ? 'Hidden story trophy' : t.name;
      li.append(chip);
      li.append(document.createTextNode(hidden ? ' — hidden until earned.' : ` — ${t.description}`));
      if (t.missable) {
        const m = document.createElement('span');
        m.className = 'pill missable';
        m.textContent = ' Possibly missable';
        li.append(m);
      }
      if (earned.has(t.name)) li.append(document.createTextNode(' ✓'));
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'guide-btn';
      btn.textContent = hidden ? 'Reveal when earned' : 'Guide';
      btn.disabled = hidden;
      btn.addEventListener('click', () => onOpen(t));
      li.append(document.createTextNode(' '), btn);
      ol.append(li);
    }
    div.append(h, p, ol);
    wrap.append(div);
  }
}

export function renderMissables(trophies, onOpen) {
  const wrap = document.getElementById('missableList');
  wrap.replaceChildren();
  const callout = document.createElement('div');
  callout.className = 'missable-callout';
  const strong = document.createElement('strong');
  strong.textContent = 'The safe rule: ';
  callout.append(strong, document.createTextNode('PowerPyx and GTABase both report only one trophy as possibly missable. Every other trophy — including all story missions and character questlines — can be finished in free-roam after the story, because there is no mission replay but nothing locks you out.'));
  wrap.append(callout);
  for (const t of trophies.filter((x) => x.missable)) {
    const div = document.createElement('div');
    div.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = `${t.name} — ${GRADE_LABEL[t.grade]}`;
    const p = document.createElement('p');
    p.textContent = t.description;
    const g = document.createElement('p');
    g.className = 'guide-text';
    g.textContent = t.guide;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-btn';
    btn.textContent = 'Full guide & sources';
    btn.addEventListener('click', () => onOpen(t));
    div.append(h, p, g, btn);
    wrap.append(div);
  }
  const safe = document.createElement('p');
  safe.textContent = 'Everything else is safe: optional missions that disappear do not matter for trophies, quest givers who vanish mid-story come back, and the 100% checklist has nothing permanently missable (PowerPyx, Step 1 notes).';
  wrap.append(safe);
}

export function renderSources(sources) {
  const list = document.getElementById('sourceList');
  list.replaceChildren();
  for (const s of sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a, document.createTextNode(` — ${s.note}`));
    list.append(li);
  }
}
