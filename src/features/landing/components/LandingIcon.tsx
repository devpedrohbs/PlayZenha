import type { ReactNode } from 'react'

export type LandingIconName =
  | 'chat'
  | 'menu'
  | 'party'
  | 'grill'
  | 'gift'
  | 'home'
  | 'trip'
  | 'drink'
  | 'group'

const paths: Record<LandingIconName, ReactNode> = {
  chat: (
    <>
      <path d="M7 8h10a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4h-1.5l-2 2-2-2H7a4 4 0 0 1-4-4v-1a4 4 0 0 1 4-4Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  party: (
    <>
      <path d="M8 21l8-18 2 7 4 4-14 7Z" />
      <path d="M13 9l2 2" />
    </>
  ),
  grill: (
    <>
      <path d="M5 14h14M7 14l-2 7M17 14l2 7M8 7c0-2 2-2 2-4M14 7c0-2 2-2 2-4" />
    </>
  ),
  gift: (
    <>
      <path d="M4 11h16v10H4z" />
      <path d="M4 15h16M12 11v10M8 11c-2 0-3-1-3-2s1-2 2-2c2 0 3 4 5 4s3-4 5-4c1 0 2 1 2 2s-1 2-3 2" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  trip: (
    <>
      <path d="M3 7h18v11H3z" />
      <path d="M7 7V5h10v2M7 18v2M17 18v2" />
    </>
  ),
  drink: (
    <>
      <path d="M6 3h12l-1 8a5 5 0 0 1-10 0L6 3Z" />
      <path d="M12 16v5M8 21h8" />
    </>
  ),
  group: (
    <>
      <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 13a4 4 0 1 0 0-8" />
      <path d="M2 21a6 6 0 0 1 12 0M14 21a6 6 0 0 1 8-5.6" />
    </>
  )
}

export const LandingIcon = ({ name }: { name: LandingIconName }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {paths[name]}
  </svg>
)
