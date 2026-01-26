import { differenceInYears, differenceInMonths, differenceInDays, subYears, subMonths } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function calculateAge(dateOfBirth: string): string {
  const timezone = 'Europe/Warsaw';
  const now = toZonedTime(new Date(), timezone);
  const birthDate = new Date(dateOfBirth);
  
  const years = differenceInYears(now, birthDate);
  const afterYears = subYears(now, years);
  const months = differenceInMonths(afterYears, birthDate);
  const afterMonths = subMonths(afterYears, months);
  const days = differenceInDays(afterMonths, birthDate);

  const parts: string[] = [];

  if (years > 0) {
    if (years === 1) {
      parts.push('1 rok');
    } else if (years >= 2 && years <= 4) {
      parts.push(`${years} lata`);
    } else {
      parts.push(`${years} lat`);
    }
  }

  if (months > 0) {
    if (months === 1) {
      parts.push('1 miesiąc');
    } else if (months >= 2 && months <= 4) {
      parts.push(`${months} miesiące`);
    } else {
      parts.push(`${months} miesięcy`);
    }
  }

  if (days > 0) {
    if (days === 1) {
      parts.push('1 dzień');
    } else {
      parts.push(`${days} dni`);
    }
  }

  if (parts.length === 0) {
    return '0 dni';
  }

  return parts.join(' ');
}
