import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import GamesCatalog from './GamesCatalog'

const apiGame = {
  id: '75cf2cbb-a7e2-4c26-9639-7f30d65f9620',
  slug: 'jogo-da-api',
  name: 'Jogo da API',
  shortDescription: 'Este jogo veio do PostgreSQL.',
  category: 'Festa',
  minPlayers: 3,
  maxPlayers: 8,
  averageDurationMinutes: 15,
  difficulty: 'easy',
  status: 'available',
  requiredPlan: 'free',
  tags: ['API'],
  featured: true,
  isNew: false,
  icon: 'spark',
  colors: ['#112233', '#445566']
}

const successResponse = () =>
  new Response(JSON.stringify([apiGame]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('GamesCatalog API integration', () => {
  it('renders games returned by the backend', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(successResponse()))

    render(
      <MemoryRouter>
        <GamesCatalog />
      </MemoryRouter>
    )

    expect(screen.getByText('Carregando jogos')).toBeInTheDocument()
    expect(await screen.findAllByText('Jogo da API')).not.toHaveLength(0)
    expect(screen.getByText('1 jogos encontrados')).toBeInTheDocument()
  })

  it('allows retrying after the backend becomes available', async () => {
    const user = userEvent.setup()
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(successResponse())
    vi.stubGlobal('fetch', fetchMock)

    render(
      <MemoryRouter>
        <GamesCatalog />
      </MemoryRouter>
    )

    expect(await screen.findByText('Nao foi possivel carregar os jogos')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(await screen.findAllByText('Jogo da API')).not.toHaveLength(0)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
