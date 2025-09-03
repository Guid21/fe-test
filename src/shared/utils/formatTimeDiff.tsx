export function formatTimeDiff(tokenCreatedTimestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - tokenCreatedTimestamp.getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return `${diffSeconds}s`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}min`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else if (diffDays < 365) {
    return `${diffDays}d`;
  } else {
    return `${diffYears}y`;
  }
}
