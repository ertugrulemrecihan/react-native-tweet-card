/**
 * Based on vercel/react-tweet (MIT)
 */

/** Twitter created_at: "Mon Mar 16 21:55:00 +0000 2026" veya ISO string */
function parseTweetDate(createdAt: string): Date {
  const d = new Date(createdAt);
  if (!Number.isNaN(d.getTime())) return d;
  const match = createdAt.match(
    /^(\w{3})\s+(\w{3})\s+(\d{1,2})\s+(\d{2}):(\d{2}):(\d{2})\s+([+-]\d{4})\s+(\d{4})$/,
  );
  if (match) {
    const [, , monthName, day, h, m, s, tz, year] = match;
    const months: Record<string, string> = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };
    const iso = `${year}-${months[monthName!] ?? '01'}-${day!.padStart(2, '0')}T${h}:${m}:${s}${tz!.slice(0, 3)}:${tz!.slice(3)}`;
    const d2 = new Date(iso);
    if (!Number.isNaN(d2.getTime())) return d2;
  }
  return new Date(0);
}

export const formatDate = (date: Date | string): string => {
  const d =
    typeof date === 'string'
      ? parseTweetDate(date)
      : date instanceof Date
        ? date
        : new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const dateStr = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${time} · ${dateStr}`;
};
