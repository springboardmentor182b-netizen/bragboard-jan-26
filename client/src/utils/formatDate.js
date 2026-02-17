import { format, parseISO } from 'date-fns';

/**
 * Formats an ISO date string to "Jan 1, 2024"
 */
function formatDate(dateString) {
  if (!dateString) return '';
  return format(parseISO(dateString), 'MMM d, yyyy');
}

export default formatDate;
