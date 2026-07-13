import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

interface AppProvidersProps {
  children: ReactNode
}

const AppProviders = ({ children }: AppProvidersProps) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

export default AppProviders
