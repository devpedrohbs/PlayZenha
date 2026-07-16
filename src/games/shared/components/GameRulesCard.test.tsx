import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import GameRulesCard from './GameRulesCard'

describe('GameRulesCard', () => {
  it('opens the game rules and closes after confirmation', async () => {
    const user = userEvent.setup()

    render(
      <GameRulesCard
        gameName="Jogo Teste"
        summary="Resumo da partida."
        rules={['Primeira regra', 'Segunda regra']}
        tip="Uma boa dica."
      />
    )

    await user.click(screen.getByRole('button', { name: 'Ver regras antes de jogar' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Jogo Teste' })).toBeInTheDocument()
    expect(screen.getByText('Primeira regra')).toBeInTheDocument()
    expect(screen.getByText('Uma boa dica.')).toBeInTheDocument()

    const dialog = screen.getByRole('dialog')
    await user.click(screen.getByRole('button', { name: 'Entendi, vamos jogar' }))

    await waitForElementToBeRemoved(dialog)
  })
})
