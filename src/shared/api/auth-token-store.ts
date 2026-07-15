interface StoredTokens {
  accessToken: string
}

let memoryTokens: StoredTokens | null = null

export const authTokenStore = {
  getAccessToken(): string | null {
    return memoryTokens?.accessToken ?? null
  },

  setTokens(tokens: StoredTokens): void {
    memoryTokens = { accessToken: tokens.accessToken }
  },

  clear(): void {
    memoryTokens = null
  }
}
