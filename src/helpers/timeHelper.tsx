export function diff_minutes(until: Date, from: Date) {
  let diff = (until.getTime() - from.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

/**
 * Function to format a date string based on the user's locale settings.
 * @param dateString - The ISO format date string (e.g., "2024-08-29T08:09:25Z").
 * @returns The localized date string in a readable format (e.g., "August 29, 2024").
 */
export const formatDateString = (dateString: string): string => {
  // Convert the input string into a Date object
  const date: Date = new Date(dateString);

  // Formatting options for displaying the date
  const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};

  // Return the date formatted according to the user's locale
  return date.toLocaleDateString(undefined, options);
};

export const formatTimeStringHoursAndMinutes = (dateString: string): string => {
  // Convert the input string into a Date object
  const date: Date = new Date(dateString);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
