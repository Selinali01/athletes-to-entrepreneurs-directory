import { queryOptions } from '@tanstack/react-query';
import type { Guest } from './types';

// Guests API — BubbleLab flow 12088. Reads the "Guests" + "Profiles" tabs of the
// Athletes to Entrepreneurs spreadsheet and returns every guest with their
// normalized LinkedIn profile embedded, in a single response.
const BASE_URL: string =
  import.meta.env.VITE_GUESTS_API_URL ??
  'https://api.nodex.bubblelab.ai/webhook/user_32FiRccIHx70KCqVoJDFwDRdeev/hYBksWsBke3S';

interface ApiPayload {
  success: boolean;
  count: number;
  guests: Guest[];
}

export async function fetchGuests(): Promise<Guest[]> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);

  const json = (await res.json()) as { data?: ApiPayload } & Partial<ApiPayload>;
  // Webhook wraps the flow output under `data`; fall back to the raw body.
  const payload = (json.data ?? json) as ApiPayload;
  if (!payload || !Array.isArray(payload.guests)) {
    throw new Error('Unexpected response from Guests API');
  }
  return payload.guests;
}

export const guestsQuery = queryOptions({
  queryKey: ['guests'] as const,
  queryFn: fetchGuests,
  staleTime: 30 * 60_000,
  gcTime: 24 * 60 * 60_000,
  refetchOnWindowFocus: false,
  retry: 1,
});
