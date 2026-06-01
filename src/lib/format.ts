import type { Guest } from './types';

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SWATCHES = [
  { bg: '#7a3954', fg: '#fff' },
  { bg: '#9c5670', fg: '#fff' },
  { bg: '#3f5a52', fg: '#fff' },
  { bg: '#b06a3b', fg: '#fff' },
  { bg: '#4a5478', fg: '#fff' },
  { bg: '#8a6d3b', fg: '#fff' },
  { bg: '#6b4a6e', fg: '#fff' },
  { bg: '#3d6b6b', fg: '#fff' },
];

export function avatarSwatch(seed: string): { bg: string; fg: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return SWATCHES[hash % SWATCHES.length];
}

/** Strip the "| Name" / "with Name" suffix to get the episode's descriptive part. */
export function episodeBlurb(g: Guest): string {
  let t = g.episodeTitle;
  const pipe = t.lastIndexOf('|');
  if (pipe > 0) t = t.slice(0, pipe);
  return t.trim();
}

export function publishedYear(iso: string): string {
  const m = iso.match(/(\d{4})/);
  return m ? m[1] : '';
}

/** A short one-liner for cards: headline if present, else company/title, else episode blurb. */
export function tagline(g: Guest): string {
  const p = g.profile;
  if (p?.headline) return p.headline;
  if (p?.currentTitle && p?.currentCompany) return `${p.currentTitle} · ${p.currentCompany}`;
  if (p?.currentCompany) return p.currentCompany;
  return episodeBlurb(g);
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface IndexedGuest {
  guest: Guest;
  haystack: string;
}

export function buildIndex(guests: Guest[]): IndexedGuest[] {
  return guests.map((guest) => {
    const p = guest.profile;
    const haystack = [
      guest.name,
      guest.episodeTitle,
      p?.headline ?? '',
      p?.currentCompany ?? '',
      p?.currentTitle ?? '',
      p?.location ?? '',
      (p?.skills ?? []).join(' '),
    ]
      .join(' ')
      .toLowerCase();
    return { guest, haystack };
  });
}

export interface SearchResult {
  guest: Guest;
  score: number;
}

export function searchGuests(index: IndexedGuest[], query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return index.map((i) => ({ guest: i.guest, score: 0 }));
  }
  const tokens = q.split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];
  for (const item of index) {
    let ok = true;
    let score = 0;
    for (const tok of tokens) {
      if (!item.haystack.includes(tok)) {
        ok = false;
        break;
      }
      if (item.guest.name.toLowerCase().includes(tok)) score += 100;
      else score += 1;
    }
    if (ok) results.push({ guest: item.guest, score });
  }
  results.sort((a, b) => b.score - a.score || a.guest.name.localeCompare(b.guest.name));
  return results;
}
