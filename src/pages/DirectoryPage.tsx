import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { guestsQuery } from '../lib/api';
import { buildIndex, searchGuests, tagline, publishedYear } from '../lib/format';
import type { Guest } from '../lib/types';
import { GuestAvatar } from '../components/GuestAvatar';

const PAGE_SIZE = 60;

export function DirectoryPage() {
  const { data, isLoading, isFetching, error, refetch } = useQuery(guestsQuery);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);

  const guests = data ?? [];
  const index = useMemo(() => buildIndex(guests), [guests]);
  const results = useMemo(() => searchGuests(index, deferredQuery), [index, deferredQuery]);
  const visible = results.slice(0, limit);
  const withLinkedIn = guests.filter((g) => g.hasProfile).length;

  return (
    <main className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-aubergine)]">
          Athletes to Entrepreneurs · The Alumni Journey
        </p>
        <h1 className="font-display text-[40px] leading-[1.05] sm:text-[52px]">Guest Directory</h1>
        <p className="max-w-2xl text-[14px] text-[var(--color-muted)]">
          Every guest from the podcast, with their LinkedIn profile loaded in.{' '}
          <span className="text-[var(--color-ink)]">{guests.length}</span> guests ·{' '}
          <span className="text-[var(--color-ink)]">{withLinkedIn}</span> with full LinkedIn.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
            placeholder="Search by name, company, skill, school…"
            className="w-full rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-[14px] outline-none focus:border-[var(--color-aubergine-soft)]"
          />
        </div>
        <span className="font-mono text-[12px] text-[var(--color-muted)]">
          {results.length} {results.length === 1 ? 'match' : 'matches'}
        </span>
        <button
          onClick={() => refetch()}
          className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-[12px] font-medium card-hover"
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {isLoading && <p className="text-[14px] text-[var(--color-muted)]">Loading guests…</p>}
      {error && (
        <p className="text-[14px] text-[var(--color-aubergine)]">
          Couldn’t load guests. {(error as Error).message}
        </p>
      )}

      <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {visible.map((r, i) => (
          <GuestCard key={r.guest.id} guest={r.guest} delay={Math.min(i, 16) * 0.012} />
        ))}
      </div>

      {visible.length < results.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="rounded-full border border-[var(--color-line)] bg-white px-6 py-2.5 text-[13px] font-medium card-hover"
          >
            Show more ({results.length - visible.length} left)
          </button>
        </div>
      )}
    </main>
  );
}

function GuestCard({ guest, delay }: { guest: Guest; delay: number }) {
  const year = publishedYear(guest.publishedDate);
  return (
    <div
      className="rise surface flex flex-col rounded-[18px] card-hover"
      style={{ animationDelay: `${delay}s` }}
    >
      <Link to={`/g/${guest.id}`} className="flex flex-1 items-start gap-3 p-4 pb-2">
        <GuestAvatar guest={guest} size={46} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight">{guest.name}</p>
          <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-[var(--color-muted)]">
            {tagline(guest)}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2 px-4 pb-3">
        {guest.episodeUrl ? (
          <a
            href={guest.episodeUrl}
            target="_blank"
            rel="noreferrer"
            className="link-underline inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-aubergine)]"
          >
            ▶ Episode
          </a>
        ) : (
          <span />
        )}
        {year && <span className="font-mono text-[10.5px] text-[var(--color-muted)]">{year}</span>}
      </div>
    </div>
  );
}
