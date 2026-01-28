import { startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { Walk, EventType } from '@/types';

const TIMEZONE = 'Europe/Warsaw';

export function getWarsawNow(): Date {
  return toZonedTime(new Date(), TIMEZONE);
}

export function getWarsawDate(date: Date | string): Date {
  return toZonedTime(new Date(date), TIMEZONE);
}

export function getCurrentWeekRange(): { start: Date; end: Date } {
  const now = getWarsawNow();
  // European standard: Monday is first day of week (weekStartsOn: 1)
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return { start, end };
}

export function getWeekWalksCount(walks: Walk[], dogId: string): number {
  const { start, end } = getCurrentWeekRange();
  
  return walks.filter(walk => {
    // Only count walk events (not home events)
    const isWalkEvent = walk.eventType === 'pee_walk' || 
                        walk.eventType === 'poop_walk' || 
                        walk.eventType === 'both_walk';
    
    if (!isWalkEvent) return false;
    if (walk.dogId !== dogId) return false;
    
    const walkDate = getWarsawDate(walk.timestamp);
    return isWithinInterval(walkDate, { start, end });
  }).length;
}

export function getMonthRange(date: Date): { start: Date; end: Date } {
  const warsawDate = getWarsawDate(date);
  return {
    start: startOfMonth(warsawDate),
    end: endOfMonth(warsawDate),
  };
}

export function getDaysInMonth(date: Date): Date[] {
  const { start, end } = getMonthRange(date);
  return eachDayOfInterval({ start, end });
}

export function getWalksForDay(walks: Walk[], date: Date): Walk[] {
  const targetDate = getWarsawDate(date);
  
  return walks.filter(walk => {
    const walkDate = getWarsawDate(walk.timestamp);
    const isWalkEvent = walk.eventType === 'pee_walk' || 
                        walk.eventType === 'poop_walk' || 
                        walk.eventType === 'both_walk';
    return isWalkEvent && isSameDay(walkDate, targetDate);
  });
}

export function getWalksCountForMonth(walks: Walk[], date: Date): number {
  const { start, end } = getMonthRange(date);
  
  return walks.filter(walk => {
    const isWalkEvent = walk.eventType === 'pee_walk' || 
                        walk.eventType === 'poop_walk' || 
                        walk.eventType === 'both_walk';
    
    if (!isWalkEvent) return false;
    
    const walkDate = getWarsawDate(walk.timestamp);
    return isWithinInterval(walkDate, { start, end });
  }).length;
}

export function getTotalWalksCount(walks: Walk[]): number {
  return walks.filter(walk => {
    return walk.eventType === 'pee_walk' || 
           walk.eventType === 'poop_walk' || 
           walk.eventType === 'both_walk';
  }).length;
}

export function formatMonthYear(date: Date): string {
  return format(date, 'LLLL yyyy', { locale: pl });
}

export function formatTime(timestamp: string): string {
  const date = getWarsawDate(timestamp);
  return format(date, 'HH:mm');
}

export function isGuestPerson(personId: string): boolean {
  return personId === 'guest';
}
