import { Link } from 'react-router-dom'

const Testimonial = ({ quote, author }: { quote: string; author: string }) => (
  <article className="landing-testimonial-card">
    <p>"{quote}"</p>
    <span>{author}</span>
  </article>
)

export const TestimonialsSection = () => (
  <>
    <section className="landing-section reveal" id="depoimentos">
      <div className="landing-testimonials">
        <div className="landing-quote-wall">
          <div>
            <p className="landing-eyebrow">Social proof</p>
            <h2>O grupo entende antes da primeira rodada acabar</h2>
          </div>
          <p>Historias curtas do tipo de momento em que o Playzenha entra melhor: churrasco, grupo novo e aquela hora em que alguem precisa puxar a energia.</p>
        </div>
        <div className="landing-testimonial-list">
          <Testimonial quote="Usei no churrasco e virou a atracao principal da noite." author="Marina, resenha de sabado" />
          <Testimonial quote="Foi perfeito para quebrar o gelo no grupo." author="Rafa, aniversario com amigos novos" />
          <Testimonial quote="Todo mundo abriu no celular e em 2 minutos ja estava jogando." author="Joao, pre-role antes da festa" />
        </div>
      </div>
    </section>

    <section className="landing-final-cta reveal">
      <p className="landing-eyebrow">Pronto para jogar</p>
      <h2>Seu proximo role pode ser muito mais divertido.</h2>
      <p>Abra no celular, chame a galera e escolha o primeiro jogo. O resto vira historia do grupo.</p>
      <Link className="landing-button landing-button-primary" to="/cadastro">Comecar a jogar agora</Link>
    </section>
  </>
)
