import { Link } from 'react-router-dom'
import { BENEFITS } from '../../../pages/HomePage/model/constants'

export const BenefitsSection = () => (
  <section className="landing-section reveal">
    <div className="landing-benefits">
      <div className="landing-benefit-hero">
        <div>
          <p className="landing-eyebrow">Beneficios</p>
          <h2>Uma pessoa abre. A galera inteira joga.</h2>
          <p>O Playzenha foi feito para a mesa, nao para cada pessoa ficar presa na propria tela. Uma conta inicia a partida e o celular circula pelo grupo.</p>
        </div>
        <Link className="landing-button landing-button-primary" to="/cadastro" state={{ from: '/jogos/impostor' }}>Testar com o Impostor</Link>
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
