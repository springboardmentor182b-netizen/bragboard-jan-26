/**
 * Truncates text to maxLength characters and appends "..."
 */
function truncateText(text = '', maxLength = 120) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export default truncateText;
