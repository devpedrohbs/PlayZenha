import { STEPS } from '../../../pages/HomePage/model/constants'
import { SectionHead } from './SectionHead'

export const HowItWorksSection = () => (
  <section className="landing-section reveal" id="como-funciona">
    <SectionHead eyebrow="Como funciona" title="Da tela para a resenha em segundos">
      A experiencia precisa ser obvia na primeira visita: abriu no celular, escolheu o clima do role e todo mundo entra na brincadeira.
    </SectionHead>
    <div className="landing-steps">
      {STEPS.map(({ number, title, text }) => (
        <article className="landing-step-card" key={number}>
          <div className="landing-step-number">{number}</div>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
)
