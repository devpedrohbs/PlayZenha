import { Link } from 'react-router-dom'

const Objection = ({ title, answer }: { title: string; answer: string }) => (
  <article className="landing-testimonial-card">
    <h3>{title}</h3>
    <p>{answer}</p>
  </article>
)

export const TestimonialsSection = () => (
  <>
    <section className="landing-section reveal" id="duvidas">
      <div className="landing-testimonials">
        <div className="landing-quote-wall">
          <div>
            <p className="landing-eyebrow">Antes de chamar a galera</p>
            <h2>As duvidas que nao precisam atrasar a partida</h2>
          </div>
          <p>Respostas diretas sobre conta, instalacao e plano gratis para voce decidir se o Playzenha cabe na sua resenha.</p>
        </div>
        <div className="landing-testimonial-list">
          <Objection title="Todo mundo precisa pagar?" answer="Nao. Uma pessoa abre a partida e conduz o jogo para o grupo." />
          <Objection title="Precisa instalar?" answer="Nao. O Playzenha roda direto no navegador do celular." />
          <Objection title="Da para testar antes?" answer="Sim. Crie a conta sem cartao e jogue o Impostor no plano gratis." />
        </div>
      </div>
    </section>

    <section className="landing-final-cta reveal">
      <p className="landing-eyebrow">Pronto para jogar</p>
      <h2>Teste na proxima resenha. Decida depois.</h2>
      <p>Crie sua conta sem cartao e entre direto no Impostor. O Premium so entra quando voce quiser mais jogos.</p>
      <Link className="landing-button landing-button-primary" to="/cadastro" state={{ from: '/jogos/impostor' }}>Criar conta gratis e jogar</Link>
    </section>
  </>
)
