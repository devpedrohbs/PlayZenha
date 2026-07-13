import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRouter } from './router'

const renderRoute = (initialRoute: string) =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AppRouter />
    </MemoryRouter>
  )

describe('application routes', () => {
  it('renders the home route and navigates to the games library', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    expect(screen.getByRole('heading', { name: 'Transforme qualquer role em um jogo' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Ver jogos disponiveis' }))

    expect(screen.getByRole('heading', { name: 'Biblioteca de Jogos' })).toBeInTheDocument()
  })

  it('renders the games library route', () => {
    renderRoute('/jogos')

    expect(screen.getByRole('heading', { name: 'Biblioteca de Jogos' })).toBeInTheDocument()
  })

  it('renders the login form', () => {
    renderRoute('/login')

    expect(screen.getByRole('heading', { name: 'Entre na resenha' })).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('renders the not found page', () => {
    renderRoute('/rota-inexistente')

    expect(screen.getByRole('heading', { name: 'Essa rota saiu da resenha' })).toBeInTheDocument()
  })
})
