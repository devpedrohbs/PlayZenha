import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PricingSection } from './PricingSection'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PricingSection API integration', () => {
  it('renders active plans returned by the backend', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([
            {
              code: 'premium',
              name: 'Premium API',
              priceCents: 2490,
              currency: 'BRL',
              billingInterval: 'month',
              entitlements: ['play_free_games', 'play_premium_games'],
              active: true
            }
          ]),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
    )

    render(<PricingSection onPlanClick={vi.fn()} />)

    expect(screen.getByText('Carregando planos')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Premium API' })).toBeInTheDocument()
    expect(screen.getByText('R$ 24,90/mes')).toBeInTheDocument()
  })
})
