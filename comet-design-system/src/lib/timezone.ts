/**
 * timezone.ts — pins scheduling to Damascus time regardless of the
 * device/browser's local timezone.
 */

export const APP_TIME_ZONE = 'Asia/Damascus'

interface ZonedParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts = Object.fromEntries(dtf.formatToParts(date).map(p => [p.type, p.value]))
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  }
}

/**
 * Converts a wall-clock date/time meant as "local time in timeZone"
 * into the Date representing the correct UTC instant.
 */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string = APP_TIME_ZONE,
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute)
  const shownInZone = getZonedParts(new Date(utcGuess), timeZone)
  const shownAsUtc = Date.UTC(
    shownInZone.year,
    shownInZone.month - 1,
    shownInZone.day,
    shownInZone.hour,
    shownInZone.minute,
    shownInZone.second,
  )
  return new Date(utcGuess + (utcGuess - shownAsUtc))
}

/** Returns the wall-clock date/time parts of `date` as seen in `timeZone`. */
export function getDatePartsInZone(date: Date, timeZone: string = APP_TIME_ZONE): ZonedParts {
  return getZonedParts(date, timeZone)
}
