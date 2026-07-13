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
import { useHomePage } from './model/useHomePage'

const HomeView: React.FC = () => {
  const navigate = useNavigate()
  const {
    activeFilter,
    filteredGames,
    menuOpen,
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
        />

        <main id="top">
          <HeroSection selectedGame={selectedGame} onShowToast={showToast} />
          <HowItWorksSection />
          <FeaturedGamesSection
            activeFilter={activeFilter}
            filteredGames={filteredGames}
            selectedGame={selectedGame}
            onFilterChange={setActiveFilter}
            onGameSelect={selectGame}
            onGameNavigate={navigate}
          />
          <UseCasesSection />
          <BenefitsSection />
          <PricingSection onSignupClick={() => navigate('/cadastro')} />
          <TestimonialsSection />
        </main>

        <LandingFooter />
      </div>
      <Toast className="landing-toast" message={toast} visible={Boolean(toast)} />
    </div>
  )
}

export default HomeView
