export const formatIsoDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const normalizeDate = (dateString: string): string => {
  // Check if the date is already in the correct format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Handle MM/DD/YYYY format
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts.map(Number);
    if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
      // Convert to YYYY-MM-DD format
      return new Date(year, month - 1, day).toISOString().split('T')[0];
    }
  }

  // Return an empty string or a fallback value if the format is unrecognized
  console.warn('Invalid date format:', dateString);
  return '';
};

/**
 * Format a date-time string in ISO format to a human-readable format.
 * @returns string - The formatted date-time string. (ex: '9/30/2021, 12:34:56 PM')
 * @param isoDate - The date-time string in ISO format. (ex: '2021-09-30T12:34:56Z')
 */
export const formatDateTime = (isoDate: string) => {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
};
