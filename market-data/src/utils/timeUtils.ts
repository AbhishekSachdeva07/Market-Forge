import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function untilNext7(): number {
  const now = dayjs().tz('Asia/Kolkata');

  let next7AM = now
    .hour(7)
    .minute(0)
    .second(0)
    .millisecond(0);

  if (now.isAfter(next7AM)) {
    next7AM = next7AM.add(1, 'day');
  }

  return next7AM.diff(now, 'second');
}