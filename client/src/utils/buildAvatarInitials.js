/**
 * Returns initials from a full name. "Jane Doe" => "JD"
 */
function buildAvatarInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

export default buildAvatarInitials;
