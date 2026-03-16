/**
 * Extracts tweet ID from a Twitter/X URL or returns the string if it's already an ID.
 */

const TWEET_ID_REGEX = /^[0-9]+$/;
const STATUS_URL_REGEX = /(?:twitter\.com|x\.com)\/(?:\w+)\/status\/(\d+)/i;

export function getTweetId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  if (TWEET_ID_REGEX.test(trimmed) && trimmed.length <= 40) {
    return trimmed;
  }
  const match = trimmed.match(STATUS_URL_REGEX);
  return match ? match[1]! : null;
}
