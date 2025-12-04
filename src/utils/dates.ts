import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, addDays, isBefore, parseISO } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
};

export const formatRelative = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isYesterday(d)) return 'Yesterday';
  return formatDistanceToNow(d, { addSuffix: true });
};

export const formatBirthday = (birthday: string): string => {
  const d = parseISO(birthday);
  return format(d, 'MMMM d');
};

export const getUpcomingDate = (dateStr: string, daysAhead: number): Date | null => {
  const date = parseISO(dateStr);
  const thisYear = new Date().getFullYear();
  const thisYearDate = new Date(thisYear, date.getMonth(), date.getDate());
  const nextYearDate = new Date(thisYear + 1, date.getMonth(), date.getDate());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = addDays(today, daysAhead);

  if (!isBefore(thisYearDate, today) && !isBefore(checkDate, thisYearDate)) {
    return thisYearDate;
  }
  if (!isBefore(nextYearDate, today) && !isBefore(checkDate, nextYearDate)) {
    return nextYearDate;
  }
  return null;
};

export const getDaysUntil = (dateStr: string): number => {
  const date = parseISO(dateStr);
  const thisYear = new Date().getFullYear();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let targetDate = new Date(thisYear, date.getMonth(), date.getDate());
  if (isBefore(targetDate, today)) {
    targetDate = new Date(thisYear + 1, date.getMonth(), date.getDate());
  }

  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
