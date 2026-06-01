import type { Education, Experience, GuestProfile } from '../lib/types';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
      {children}
    </h2>
  );
}

function ExperienceItem({ exp }: { exp: Experience }) {
  const dates = [exp.startText, exp.endText].filter(Boolean).join(' – ');
  return (
    <li className="surface rounded-[14px] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="text-[14px] font-semibold">{exp.position ?? 'Role'}</p>
        {dates && <span className="font-mono text-[11px] text-[var(--color-muted)]">{dates}</span>}
      </div>
      {exp.companyName && <p className="text-[13px] text-[var(--color-ink)]">{exp.companyName}</p>}
      {(exp.employmentType || exp.location) && (
        <p className="mt-0.5 text-[12px] text-[var(--color-muted)]">
          {[exp.employmentType, exp.location].filter(Boolean).join(' · ')}
        </p>
      )}
      {exp.description && (
        <p className="mt-2 whitespace-pre-wrap text-[12.5px] leading-relaxed text-[var(--color-muted)]">
          {exp.description}
        </p>
      )}
    </li>
  );
}

function EducationItem({ edu }: { edu: Education }) {
  return (
    <li className="surface rounded-[14px] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="text-[14px] font-semibold">{edu.schoolName ?? 'School'}</p>
        {edu.period && (
          <span className="font-mono text-[11px] text-[var(--color-muted)]">{edu.period}</span>
        )}
      </div>
      {(edu.degree || edu.fieldOfStudy) && (
        <p className="text-[13px] text-[var(--color-muted)]">
          {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
        </p>
      )}
    </li>
  );
}

export function LinkedInSection({ profile }: { profile: GuestProfile }) {
  return (
    <div className="flex flex-col gap-8">
      {profile.about && (
        <section className="flex flex-col gap-3">
          <SectionHeading>About</SectionHeading>
          <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--color-ink)]">
            {profile.about}
          </p>
        </section>
      )}

      {profile.experience.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeading>Experience</SectionHeading>
          <ol className="flex flex-col gap-2.5">
            {profile.experience.map((e, i) => (
              <ExperienceItem key={i} exp={e} />
            ))}
          </ol>
        </section>
      )}

      {profile.education.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeading>Education</SectionHeading>
          <ol className="flex flex-col gap-2.5">
            {profile.education.map((e, i) => (
              <EducationItem key={i} edu={e} />
            ))}
          </ol>
        </section>
      )}

      {profile.skills.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeading>Skills</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span
                key={i}
                className="rounded-full border border-[var(--color-line)] bg-white px-3 py-1 text-[12.5px]"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {profile.languages.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeading>Languages</SectionHeading>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
            {profile.languages.map((l, i) => (
              <li key={i}>
                {l.name}
                {l.proficiency && (
                  <span className="text-[var(--color-muted)]"> — {l.proficiency}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.certifications.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeading>Certifications</SectionHeading>
          <ul className="flex flex-col gap-1.5 text-[13px]">
            {profile.certifications.map((c, i) => (
              <li key={i}>
                <span className="font-medium">{c.title}</span>
                {c.issuedBy && <span className="text-[var(--color-muted)]"> · {c.issuedBy}</span>}
                {c.issuedAt && (
                  <span className="text-[var(--color-muted)]"> · {c.issuedAt}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.scrapedAt && (
        <p className="font-mono text-[10.5px] text-[var(--color-muted)]">
          LinkedIn data synced {new Date(profile.scrapedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
