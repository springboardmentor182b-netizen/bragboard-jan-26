/**
 * Sums up all reaction counts from a reaction_counts object.
 * e.g. { like: 2, clap: 3, star: 1 } => 6
 */
function calculateTotalReactions(reactionCounts = {}) {
  return Object.values(reactionCounts).reduce((sum, count) => sum + (count || 0), 0);
}

export default calculateTotalReactions;
