import { Walk, EventType } from '@/types';
import { getWarsawDate, getWarsawNow } from './weekUtils';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';

/**
 * Calculate a dog's happiness score (1-10) based on walk frequency in the last 7 days.
 * Ideal: 3+ walks per day = 10, 0 walks = 1
 */
export function getDogHappiness(walks: Walk[], dogId: string): number {
  const now = getWarsawNow();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentWalks = walks.filter(w => {
    if (w.dogId !== dogId) return false;
    if (!w.eventType.endsWith('_walk')) return false;
    const d = getWarsawDate(w.timestamp);
    return d >= sevenDaysAgo && d <= now;
  });

  const count = recentWalks.length;
  // ~3 walks/day = 21/week => score 10, 0 => score 1
  const score = Math.min(10, Math.max(1, Math.round((count / 21) * 9 + 1)));
  return score;
}

export function getHappinessEmoji(score: number): string {
  if (score >= 9) return '🥰';
  if (score >= 7) return '😊';
  if (score >= 5) return '🙂';
  if (score >= 3) return '😐';
  return '😢';
}

export function getHappinessLabel(score: number): string {
  if (score >= 9) return 'Mega szczęśliwy!';
  if (score >= 7) return 'Zadowolony';
  if (score >= 5) return 'W porządku';
  if (score >= 3) return 'Mógłby więcej';
  return 'Potrzebuje spacerów!';
}

export function getHappinessColor(score: number): string {
  if (score >= 9) return 'hsl(var(--success-green))';
  if (score >= 7) return 'hsl(var(--primary))';
  if (score >= 5) return 'hsl(var(--secondary))';
  if (score >= 3) return 'hsl(var(--accent))';
  return 'hsl(var(--destructive))';
}

/**
 * Filter walks within a date range
 */
export function getWalksInRange(walks: Walk[], start: Date, end: Date): Walk[] {
  return walks.filter(w => {
    const d = getWarsawDate(w.timestamp);
    return isWithinInterval(d, { start, end });
  });
}

/**
 * Get current week range (Mon-Sun)
 */
export function getStatsWeekRange(): { start: Date; end: Date } {
  const now = getWarsawNow();
  return {
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  };
}

/**
 * Get current month range
 */
export function getStatsMonthRange(): { start: Date; end: Date } {
  const now = getWarsawNow();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
}

/**
 * Calculate average walk hour from a set of walks (only walk events, not home)
 */
export function getAverageWalkHour(walks: Walk[]): string | null {
  const walkEvents = walks.filter(w => w.eventType.endsWith('_walk'));
  if (walkEvents.length === 0) return null;

  let totalMinutes = 0;
  for (const w of walkEvents) {
    const d = getWarsawDate(w.timestamp);
    totalMinutes += d.getHours() * 60 + d.getMinutes();
  }

  const avgMinutes = Math.round(totalMinutes / walkEvents.length);
  const hours = Math.floor(avgMinutes / 60);
  const mins = avgMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Calculate average walk hour per dog
 */
export function getAverageWalkHourForDog(walks: Walk[], dogId: string): string | null {
  return getAverageWalkHour(walks.filter(w => w.dogId === dogId));
}

/**
 * Time-of-day periods for walk averages
 */
type TimePeriod = 'morning' | 'afternoon' | 'evening';

interface PeriodAverage {
  period: TimePeriod;
  label: string;
  emoji: string;
  avg: string | null;
  count: number;
}

function getTimePeriod(hour: number): TimePeriod {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/**
 * Calculate average walk hours split by morning (before 12), afternoon (12-17), evening (17+)
 */
export function getAverageWalkHoursByPeriod(walks: Walk[]): PeriodAverage[] {
  const walkEvents = walks.filter(w => w.eventType.endsWith('_walk'));

  const buckets: Record<TimePeriod, number[]> = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  for (const w of walkEvents) {
    const d = getWarsawDate(w.timestamp);
    const minutes = d.getHours() * 60 + d.getMinutes();
    const period = getTimePeriod(d.getHours());
    buckets[period].push(minutes);
  }

  const meta: Record<TimePeriod, { label: string; emoji: string }> = {
    morning: { label: 'Poranny', emoji: '🌅' },
    afternoon: { label: 'Południowy', emoji: '☀️' },
    evening: { label: 'Wieczorny', emoji: '🌙' },
  };

  return (['morning', 'afternoon', 'evening'] as TimePeriod[]).map(period => {
    const mins = buckets[period];
    let avg: string | null = null;
    if (mins.length > 0) {
      const avgMin = Math.round(mins.reduce((a, b) => a + b, 0) / mins.length);
      const h = Math.floor(avgMin / 60);
      const m = avgMin % 60;
      avg = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    return { period, ...meta[period], avg, count: mins.length };
  });
}
