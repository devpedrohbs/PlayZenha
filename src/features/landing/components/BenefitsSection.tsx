import { Link } from 'react-router-dom'
import { BENEFITS } from '../../../pages/HomePage/model/constants'

export const BenefitsSection = () => (
  <section className="landing-section reveal">
    <div className="landing-benefits">
      <div className="landing-benefit-hero">
        <div>
          <p className="landing-eyebrow">Beneficios</p>
          <h2>Menos enrolacao. Mais risada.</h2>
          <p>Playzenha foi pensado para entrar no meio do role sem virar uma explicacao longa. O jogo precisa caber na mao e no tempo da galera.</p>
        </div>
        <Link className="landing-button landing-button-primary" to="/cadastro">Comecar de boa</Link>
      </div>
      <div className="landing-benefit-stack">
        {BENEFITS.map(({ title, text }) => (
          <article className="landing-benefit-card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
)
