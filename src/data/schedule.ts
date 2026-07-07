/**
 * Single source of truth for the show timetable.
 *
 * Read by:
 *  - /show page (full schedule view)
 *  - /zone/zone6 (인피니티 포레스트 detail page)
 *
 * Updating times here updates both surfaces simultaneously. If schedule
 * variations by season/weekday emerge later, expand this to a function
 * returning the slot list for a given date.
 */
export const showTimes = [19:30', '20:00', '20:30', '21:00'] as const
