import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { GameCatalogItem } from '../games.types'
import { GameCard } from './GameCard'

const impostorGame: GameCatalogItem = {
  id: 'impostor-id',
  slug: 'impostor',
  name: 'Impostor',
  shortDescription: 'Descubra quem esta fingindo.',
  category: 'Blefe',
  minPlayers: 3,
  maxPlayers: 16,
  averageDurationMinutes: 12,
  difficulty: 'medium',
  status: 'available',
  requiredPlan: 'free',
  tags: ['Popular'],
  featured: true,
  isNew: false,
  icon: 'mask',
  colors: ['#2b1138', '#ff335f']
}

describe('GameCard rules', () => {
  it('shows the rules before the play action', async () => {
    const user = userEvent.setup()

    render(<GameCard game={impostorGame} onPlay={vi.fn()} />)

    const rulesButton = screen.getByRole('button', { name: 'Regras' })
    const playButton = screen.getByRole('button', { name: 'Jogar' })
    expect(rulesButton.compareDocumentPosition(playButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    await user.click(rulesButton)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'Impostor' })).toBeInTheDocument()
  })
})
