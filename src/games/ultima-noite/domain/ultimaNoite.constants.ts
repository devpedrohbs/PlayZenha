import type { UltimaNoiteRole } from './ultimaNoite.types'

export const ULTIMA_NOITE_MIN_PLAYERS = 6
export const ULTIMA_NOITE_MAX_PLAYERS = 16
export const ULTIMA_NOITE_DEFAULT_PLAYER_NAMES = ['', '', '', '', '', '']

export const ULTIMA_NOITE_ROLES_CONFIG: Record<UltimaNoiteRole, { color: string; bg: string; border: string; icon: string }> = {
  Lobo: { color: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500', icon: 'ðŸº' },
  Anjo: { color: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-400', icon: 'ðŸ‘¼' },
  Detetive: { color: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-400', icon: 'ðŸ•µï¸' },
  Cidadão: { color: 'text-gray-300', bg: 'bg-gray-500/20', border: 'border-gray-500', icon: 'ðŸ‘¥' },
  Mediador: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-400', icon: 'ðŸ—£ï¸' }
}
