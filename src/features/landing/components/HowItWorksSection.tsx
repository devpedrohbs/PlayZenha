import { STEPS } from '../../../pages/HomePage/model/constants'
import { SectionHead } from './SectionHead'

export const HowItWorksSection = () => (
  <section className="landing-section reveal" id="como-funciona">
    <SectionHead eyebrow="Como funciona" title="Do cadastro a primeira rodada, sem adivinhar o proximo passo">
      Comece pelo jogo gratis. Se a galera quiser variar, o Premium libera a biblioteca disponivel para o grupo inteiro.
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
