import { formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Returns relative time string: "2 hours ago"
 */
function timeAgo(dateString) {
  if (!dateString) return '';
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

export default timeAgo;
