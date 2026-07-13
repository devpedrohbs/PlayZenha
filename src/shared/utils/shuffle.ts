export const shuffle = <T>(items: readonly T[]): T[] => {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index--) {
    const targetIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[targetIndex]] = [shuffled[targetIndex], shuffled[index]]
  }

  return shuffled
}

export const randomItem = <T>(items: readonly T[]): T | null => {
  if (items.length === 0) return null
  return items[Math.floor(Math.random() * items.length)]
}
