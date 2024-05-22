const blacklist = new Set<string>()

/**
 * Adds a token to the blacklist
 * @param {string} token - The token to blacklist
 */
export function blacklistToken(token: string): void {
  blacklist.add(token)
}

/**
 * Checks if a token is blacklisted
 * @param {string} token - The token to check
 * @returns {boolean} - True if the token is blacklisted, false otherwise
 */
export function isTokenBlacklisted(token: string): boolean {
  return blacklist.has(token)
}
