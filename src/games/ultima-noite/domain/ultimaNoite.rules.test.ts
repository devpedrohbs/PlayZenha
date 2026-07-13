import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { shuffle } from '../../../shared/utils/shuffle'
import { useUltimaNoiteGame } from '../hooks/useUltimaNoiteGame'

const PLAYER_NAMES = ['Ana', 'Bia', 'Caio', 'Duda', 'Enzo', 'Fabi']

function fillPlayerNames(
  result: { current: ReturnType<typeof useUltimaNoiteGame> },
  names: string[]
) {
  names.forEach((name, index) => {
    act(() => result.current.updatePlayerName(index, name))
  })
}

describe('ultima noite setup rules', () => {
  it('rejects fewer than six participants', () => {
    const { result } = renderHook(() => useUltimaNoiteGame())

    fillPlayerNames(result, PLAYER_NAMES.slice(0, 5))
    act(() => result.current.setMediatorIndex(0))
    act(() => result.current.startGameSetup())

    expect(result.current.showErrorModal).toContain('6 participantes')
  })

  it('requires a mediator before starting', () => {
    const { result } = renderHook(() => useUltimaNoiteGame())

    fillPlayerNames(result, PLAYER_NAMES)
    act(() => result.current.startGameSetup())

    expect(result.current.showErrorModal).toContain('MEDIADOR')
  })

  it('rejects too many special roles for the active players', () => {
    const { result } = renderHook(() => useUltimaNoiteGame())

    fillPlayerNames(result, PLAYER_NAMES)
    act(() => result.current.setMediatorIndex(0))
    act(() => result.current.setSettings({
      ...result.current.settings,
      wolvesCount: 4
    }))
    act(() => result.current.startGameSetup())

    expect(result.current.showErrorModal).toContain('Muitas')
  })

  it('starts correctly when the mediator is at index zero', () => {
    const { result } = renderHook(() => useUltimaNoiteGame())

    fillPlayerNames(result, PLAYER_NAMES)
    act(() => result.current.setMediatorIndex(0))
    act(() => result.current.startGameSetup())

    expect(result.current.showErrorModal).toBeNull()
    expect(result.current.phase).toBe('role-distribution-start')
    expect(result.current.players).toHaveLength(5)
  })

  it('shuffles without mutating the input array', () => {
    const roles = ['Lobo', 'Anjo', 'Detetive', 'Cidadao']
    const originalRoles = [...roles]
    const shuffledRoles = shuffle(roles)

    expect(roles).toEqual(originalRoles)
    expect(shuffledRoles).not.toBe(roles)
    expect(shuffledRoles).toHaveLength(roles.length)
    expect([...shuffledRoles].sort()).toEqual([...roles].sort())
  })
})
