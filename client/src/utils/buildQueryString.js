/**
 * Builds a URL query string from an object, skipping null/undefined values.
 * e.g. { page: 1, department: "Engineering" } => "?page=1&department=Engineering"
 */
function buildQueryString(params = {}) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return query ? `?${query}` : '';
}

export default buildQueryString;
