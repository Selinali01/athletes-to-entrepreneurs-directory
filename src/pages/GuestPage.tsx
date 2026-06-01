import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { guestsQuery } from '../lib/api';
import { episodeBlurb } from '../lib/format';
import { GuestAvatar } from '../components/GuestAvatar';
import { LinkedInSection } from '../components/LinkedInSection';

export function GuestPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery(guestsQuery);

  const guest = (data ?? []).find((g) => g.id === id);

  if (isLoading) {
    return <Shell><p className="text-[14px] text-[var(--color-muted)]">Loading…</p></Shell>;
  }
  if (!guest) {
    return (
      <Shell>
        <p className="text-[14px] text-[var(--color-muted)]">Guest not found.</p>
      </Shell>
    );
  }

  const p = guest.profile;
  const date = guest.publishedDate ? new Date(guest.publishedDate).toLocaleDateString() : '';

  return (
    <Shell>
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <GuestAvatar guest={guest} size={96} className="ring-1 ring-[var(--color-line)]" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h1 className="font-display text-[34px] leading-tight sm:text-[40px]">{guest.name}</h1>
            {p?.headline && <p className="text-[15px] text-[var(--color-ink)]">{p.headline}</p>}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-muted)]">
              {p?.location && <span>{p.location}</span>}
              {typeof p?.followerCount === 'number' && (
                <span>· {p.followerCount.toLocaleString()} followers</span>
              )}
            </div>
            {guest.linkedinUrl && (
              <a
                href={guest.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-aubergine)] px-4 py-2 text-[13px] font-medium text-white card-hover"
              >
                View on LinkedIn ↗
              </a>
            )}
          </div>
        </header>

        <section className="surface rounded-[18px] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Podcast episode
          </p>
          <p className="mt-2 text-[15px] font-medium leading-snug">{episodeBlurb(guest)}</p>
          {date && (
            <p className="mt-1 font-mono text-[11px] text-[var(--color-muted)]">Published {date}</p>
          )}
          {guest.episodeUrl && (
            <a
              href={guest.episodeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-[13px] font-medium card-hover"
            >
              ▶ Listen to the episode
            </a>
          )}
        </section>

        {p ? (
          <LinkedInSection profile={p} />
        ) : (
          <p className="text-[14px] text-[var(--color-muted)]">
            No LinkedIn profile available for this guest
            {guest.linkedinUrl ? '.' : ' — they aren’t on LinkedIn.'}
          </p>
        )}
      </article>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-[860px] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/"
        className="link-underline w-fit font-mono text-[12px] uppercase tracking-wider text-[var(--color-aubergine)]"
      >
        ← All guests
      </Link>
      {children}
    </main>
  );
}
