import { describe, expect, it } from 'vitest'
import { getGameRules } from './game-rules'

describe('game rules registry', () => {
  it('registers Quem Está Mentindo with the orange game identity', () => {
    expect(getGameRules('quem-esta-mentindo')).toMatchObject({
      gameName: 'Quem Está Mentindo?',
      accent: '#FF7A45'
    })
    expect(getGameRules('quem-esta-mentindo')?.rules).toHaveLength(4)
  })
})
