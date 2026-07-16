import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BenefitsSection } from '../../features/landing/components/BenefitsSection'
import { FeaturedGamesSection } from '../../features/landing/components/FeaturedGamesSection'
import { HeroSection } from '../../features/landing/components/HeroSection'
import { HowItWorksSection } from '../../features/landing/components/HowItWorksSection'
import { LandingFooter } from '../../features/landing/components/LandingFooter'
import { LandingNavbar } from '../../features/landing/components/LandingNavbar'
import { PricingSection } from '../../features/landing/components/PricingSection'
import { TestimonialsSection } from '../../features/landing/components/TestimonialsSection'
import { UseCasesSection } from '../../features/landing/components/UseCasesSection'
import { Toast } from '../../shared/components/ui'
import { useAuth } from '../../features/auth/model/auth-context'
import { useHomePage } from './model/useHomePage'

const HomeView: React.FC = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const {
    activeFilter,
    filteredGames,
    gamesError,
    gamesLoading,
    menuOpen,
    reloadGames,
    selectedGame,
    setActiveFilter,
    setMenuOpen,
    selectGame,
    showToast,
    scrollTo,
    toast
  } = useHomePage()

  return (
    <div className="landing-page">
      <div className="landing-page-shell">
        <LandingNavbar
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((open) => !open)}
          onSectionLinkClick={scrollTo}
          user={user}
          onLogout={() => void logout()}
        />

        <main id="top">
          <HeroSection selectedGame={selectedGame} onShowToast={showToast} />
          <HowItWorksSection />
          <FeaturedGamesSection
            activeFilter={activeFilter}
            filteredGames={filteredGames}
            error={gamesError}
            isLoading={gamesLoading}
            selectedGame={selectedGame}
            onFilterChange={setActiveFilter}
            onGameSelect={selectGame}
            onGameNavigate={navigate}
            onRetry={reloadGames}
          />
          <UseCasesSection />
          <BenefitsSection />
          <PricingSection
            onPlanClick={(planCode) => {
              if (planCode === 'free') {
                navigate(user ? '/jogos/impostor' : '/cadastro', {
                  state: user ? undefined : { from: '/jogos/impostor' }
                })
                return
              }

              const target = `/assinatura?plano=${planCode}`
              navigate(user ? target : '/cadastro', {
                state: user ? undefined : { from: target }
              })
            }}
          />
          <TestimonialsSection />
        </main>

        <LandingFooter />
      </div>
      <Toast className="landing-toast" message={toast} visible={Boolean(toast)} />
    </div>
  )
}

export default HomeView
