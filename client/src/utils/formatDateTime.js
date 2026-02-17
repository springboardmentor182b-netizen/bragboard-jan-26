import { format, parseISO } from 'date-fns';

/**
 * Formats an ISO date string to "Jan 1, 2024 at 3:00 PM"
 */
function formatDateTime(dateString) {
  if (!dateString) return '';
  return format(parseISO(dateString), "MMM d, yyyy 'at' h:mm a");
}

export default formatDateTime;
