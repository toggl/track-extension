import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  subHours,
  subMinutes
} from 'date-fns';

/**
 * Returns the elapsed time since `since` as a duration in the format hh:mm:ss.
 */
export const formatDuration = (start: string | number, stop?: string | number | Date) => {
  const now = stop || Date.now();
  const hours = differenceInHours(now, start);
  const minutes = differenceInMinutes(subHours(now, hours), start);
  const seconds = differenceInSeconds(subMinutes(subHours(now, hours), minutes), start);
  const timeValue = (value: number) => value.toString().padStart(2, '0');

  return `${hours}:${timeValue(minutes)}:${timeValue(seconds)}`;
}
