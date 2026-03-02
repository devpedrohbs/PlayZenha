import React from 'react'
import { motion } from 'framer-motion'
import { GameView } from '../App'
import { Users, Zap, ArrowRight, Clock, Gamepad2 } from 'lucide-react'
import GameButton from './GameButton'
import GameIcon from './GameIcon'

interface HomePageProps {
  onStartGame: (game: GameView) => void
}

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Decorative elements */}
      <div className="fixed top-4 left-4 z-0 opacity-20">
        <img src="/Assets/PNG/Blue/Default/star.png" alt="" className="w-8 h-8" />
      </div>
      <div className="fixed top-20 right-8 z-0 opacity-15">
        <img src="/Assets/PNG/Yellow/Default/star.png" alt="" className="w-6 h-6" />
      </div>
      <div className="fixed bottom-10 left-10 z-0 opacity-10">
        <img src="/Assets/PNG/Green/Default/star_outline.png" alt="" className="w-12 h-12" />
      </div>
      <div className="fixed bottom-20 right-20 z-0 opacity-15">
        <img src="/Assets/PNG/Red/Default/star_outline.png" alt="" className="w-8 h-8" />
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-br from-dark-blue to-indigo-900 overflow-hidden z-10">
        {/* Background decorative arrows */}
        <div className="absolute top-10 left-1/4 opacity-5">
          <img src="/Assets/PNG/Blue/Default/arrow_decorative_n.png" alt="" className="w-16 h-16" />
        </div>
        <div className="absolute bottom-10 right-1/3 opacity-5">
          <img src="/Assets/PNG/Yellow/Default/arrow_decorative_s.png" alt="" className="w-20 h-20" />
        </div>
        
        <nav className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 bg-playzenha-yellow rounded-full flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-playzenha-blue" />
              </div>
              <span className="font-fredoka text-2xl text-white">PLAYZENHA</span>
            </motion.div>
            <motion.div
              className="hidden md:flex items-center gap-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <a href="#sobre" className="font-comfortaa text-white/80 hover:text-white transition-colors">Sobre</a>
              <a href="#jogos" className="font-comfortaa text-white/80 hover:text-white transition-colors">Jogos</a>
              <a href="#planos" className="font-comfortaa text-white/80 hover:text-white transition-colors">Planos</a>
              <GameButton variant="primary" size="sm" className="px-6 py-2 text-sm font-bold">
                JOGAR GRÁTIS
              </GameButton>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="flex-1 text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-fredoka text-5xl md:text-7xl leading-tight mb-6">
                da mesa do bar ao
                <span className="text-playzenha-yellow"> VIRAL</span>
              </h1>
              <p className="font-comfortaa text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                A forma mais fácil e divertida de jogar <strong>jogos sociais</strong> com seus amigos, 
                criando momentos épicos e muita <span className="text-playzenha-yellow font-bold">resenha</span>!
              </p>
              <div className="relative">
                <GameButton
                  variant="primary"
                  size="lg"
                  onClick={() => onStartGame('impostor')}
                  className="text-xl inline-flex items-center gap-3 group relative z-10"
                >
                  <GameIcon type="play" variant="dark" size="md" />
                  <span>COMEÇAR A JOGAR</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </GameButton>
                {/* Decorative arrows around button */}
                <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-30">
                  <img src="/Assets/PNG/Yellow/Default/arrow_decorative_e.png" alt="" className="w-6 h-6" />
                </div>
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-30">
                  <img src="/Assets/PNG/Blue/Default/arrow_decorative_w.png" alt="" className="w-6 h-6" />
                </div>
              </div>
              <p className="font-comfortaa text-white/60 mt-4">
                Jogado por mais de <strong className="text-playzenha-yellow">2.847</strong> pessoas
              </p>
            </motion.div>
            
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="text-center relative">
                    {/* Game icons scattered */}
                    <div className="absolute -top-2 -left-2 opacity-20">
                      <img src="/Assets/PNG/Green/Default/star.png" alt="" className="w-4 h-4" />
                    </div>
                    <div className="absolute -top-1 -right-3 opacity-25">
                      <img src="/Assets/PNG/Red/Default/star_outline.png" alt="" className="w-5 h-5" />
                    </div>
                    <div className="absolute -bottom-2 left-4 opacity-15">
                      <img src="/Assets/PNG/Yellow/Default/star.png" alt="" className="w-3 h-3" />
                    </div>
                    <div className="text-8xl mb-4">🎭</div>
                    <h3 className="font-fredoka text-2xl text-white mb-2">LIVE AGORA</h3>
                    <p className="font-comfortaa text-white/80">
                      24 grupos jogando simultâneamente
                    </p>
                    {/* Play icon */}
                    <div className="flex justify-center mt-4">
                      <img src="/Assets/PNG/Extra/Default/icon_play_light.png" alt="" className="w-8 h-8 opacity-40" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Divider decorativo */}
      <div className="flex justify-center items-center py-8 relative">
        <div className="absolute left-1/4 opacity-20">
          <img src="/Assets/PNG/Blue/Default/star_outline.png" alt="" className="w-6 h-6" />
        </div>
        <div className="absolute right-1/4 opacity-20">
          <img src="/Assets/PNG/Yellow/Default/star_outline.png" alt="" className="w-6 h-6" />
        </div>
        <img 
          src="/Assets/PNG/Extra/Default/divider_edges.png" 
          alt="Divider" 
          className="w-64 h-8 opacity-40"
        />
      </div>

      {/* Sobre o PlayZenha */}
      <section id="sobre" className="py-12 md:py-20 bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 opacity-10">
          <img src="/Assets/PNG/Blue/Default/arrow_decorative_n.png" alt="" className="w-12 h-12" />
        </div>
        <div className="absolute top-20 right-20 opacity-5">
          <img src="/Assets/PNG/Yellow/Default/star_outline.png" alt="" className="w-16 h-16" />
        </div>
        <div className="absolute bottom-10 left-1/4 opacity-5">
          <img src="/Assets/PNG/Green/Default/arrow_decorative_s.png" alt="" className="w-20 h-20" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <img src="/Assets/PNG/Red/Default/star.png" alt="" className="w-10 h-10" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16 relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Decorative stars around title */}
            <div className="absolute -top-4 left-1/4 opacity-20">
              <img src="/Assets/PNG/Blue/Default/star.png" alt="" className="w-6 h-6" />
            </div>
            <div className="absolute -top-2 right-1/3 opacity-25">
              <img src="/Assets/PNG/Yellow/Default/star_outline.png" alt="" className="w-8 h-8" />
            </div>
            <h2 className="font-fredoka text-3xl md:text-6xl text-white mb-6">
              Conheça o poder da nossa <span className="text-playzenha-blue">plataforma</span>
            </h2>
            <p className="font-comfortaa text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Somos especialistas em jogos sociais, diversão garantida e momentos inesquecíveis
            </p>
            <div className="flex justify-center">
              <img src="/Assets/PNG/Extra/Default/divider.png" alt="" className="w-40 h-3 opacity-40" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Users,
                step: "1",
                title: "Reúna os amigos",
                desc: "Chame a galera e forme seu grupo de até 12 pessoas. Quanto mais, melhor a resenha!",
                image: "👥"
              },
              {
                icon: Zap,
                step: "2", 
                title: "Escolha o jogo",
                desc: "Nossa inteligência identifica automaticamente o melhor jogo para seu grupo e situação.",
                image: "🎮"
              },
              {
                icon: Zap,
                step: "3",
                title: "Vire viral na mesa",
                desc: "Use nossos jogos dinâmicos para criar momentos épicos e histórias que vão virar lenda!",
                image: "🚀"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.step}
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-playzenha-blue to-blue-800 rounded-2xl mx-auto flex items-center justify-center mb-4 relative overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow">
                    <span className="text-4xl relative z-10">{feature.image}</span>
                    {/* Game elements around icon */}
                    <div className="absolute top-1 right-1 opacity-30 group-hover:opacity-50 transition-opacity">
                      <img src="/Assets/PNG/Yellow/Default/star_outline.png" alt="" className="w-4 h-4" />
                    </div>
                    <div className="absolute bottom-1 left-1 opacity-50 group-hover:opacity-70 transition-opacity">
                      <img src="/Assets/PNG/Green/Default/star.png" alt="" className="w-3 h-3" />
                    </div>
                    <div className="absolute top-1/2 left-1 opacity-20 group-hover:opacity-40 transition-opacity">
                      <img src="/Assets/PNG/Blue/Default/icon_circle.png" alt="" className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-playzenha-yellow to-yellow-400 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="font-fredoka text-playzenha-blue font-bold">{feature.step}</span>
                  </div>
                  {/* Decorative arrows */}
                  <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src="/Assets/PNG/Blue/Default/arrow_decorative_e.png" alt="" className="w-6 h-6" />
                  </div>
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src="/Assets/PNG/Yellow/Default/arrow_decorative_w.png" alt="" className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-fredoka text-2xl text-white mb-4 group-hover:text-playzenha-yellow transition-colors">{feature.title}</h3>
                <p className="font-comfortaa text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider decorativo */}
      <div className="flex justify-center items-center py-8 relative">
        <div className="absolute left-1/3 opacity-15">
          <img src="/Assets/PNG/Blue/Default/star.png" alt="" className="w-5 h-5" />
        </div>
        <div className="absolute right-1/3 opacity-20">
          <img src="/Assets/PNG/Green/Default/star_outline.png" alt="" className="w-6 h-6" />
        </div>
        <div className="absolute left-1/4 opacity-10">
          <img src="/Assets/PNG/Yellow/Default/arrow_decorative_n.png" alt="" className="w-8 h-8" />
        </div>
        <div className="absolute right-1/4 opacity-10">
          <img src="/Assets/PNG/Red/Default/arrow_decorative_s.png" alt="" className="w-8 h-8" />
        </div>
        <img 
          src="/Assets/PNG/Extra/Default/divider.png" 
          alt="Divider" 
          className="w-48 h-6 opacity-40"
        />
      </div>

      {/* Jogo em Destaque - Impostor */}
      <section id="jogos" className="py-12 md:py-20 bg-dark-bg relative overflow-hidden">
        {/* Background game elements */}
        <div className="absolute top-16 left-8 opacity-5">
          <img src="/Assets/PNG/Blue/Default/star_outline.png" alt="" className="w-20 h-20" />
        </div>
        <div className="absolute top-32 right-12 opacity-5">
          <img src="/Assets/PNG/Yellow/Default/arrow_decorative_n.png" alt="" className="w-16 h-16" />
        </div>
        <div className="absolute bottom-16 left-16 opacity-5">
          <img src="/Assets/PNG/Green/Default/star.png" alt="" className="w-14 h-14" />
        </div>
        <div className="absolute bottom-24 right-8 opacity-5">
          <img src="/Assets/PNG/Red/Default/arrow_decorative_s.png" alt="" className="w-18 h-18" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16 relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Decorative elements around title */}
            <div className="absolute -top-6 left-1/4 opacity-20">
              <img src="/Assets/PNG/Yellow/Default/star.png" alt="" className="w-8 h-8" />
            </div>
            <div className="absolute -top-4 right-1/4 opacity-15">
              <img src="/Assets/PNG/Blue/Default/star_outline.png" alt="" className="w-10 h-10" />
            </div>
            <h2 className="font-fredoka text-3xl md:text-6xl text-white mb-6">
              Jogo em <span className="text-playzenha-yellow">destaque</span>
            </h2>
            <p className="font-comfortaa text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              Nosso jogo mais popular que já causou mais de 1.500 discussões épicas
            </p>
            <div className="flex justify-center items-center gap-4">
              <img src="/Assets/PNG/Extra/Default/icon_play_light.png" alt="" className="w-6 h-6 opacity-40" />
              <img src="/Assets/PNG/Extra/Default/divider_edges.png" alt="" className="w-32 h-4 opacity-30" />
              <img src="/Assets/PNG/Extra/Default/icon_play_light.png" alt="" className="w-6 h-6 opacity-40 transform scale-x-[-1]" />
            </div>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-br from-dark-blue to-blue-900 rounded-3xl overflow-hidden shadow-2xl border border-playzenha-blue/30 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Decorative elements in card */}
            <div className="absolute top-4 left-4 opacity-15">
              <img src="/Assets/PNG/Yellow/Default/star.png" alt="" className="w-6 h-6" />
            </div>
            <div className="absolute top-6 right-6 opacity-10">
              <img src="/Assets/PNG/Blue/Default/star_outline.png" alt="" className="w-8 h-8" />
            </div>
            <div className="absolute bottom-4 left-6 opacity-15">
              <img src="/Assets/PNG/Green/Default/star_outline.png" alt="" className="w-5 h-5" />
            </div>
            <div className="absolute bottom-6 right-4 opacity-10">
              <img src="/Assets/PNG/Red/Default/star.png" alt="" className="w-7 h-7" />
            </div>
            
            <div className="p-6 md:p-12 relative z-10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <img src="/Assets/PNG/Yellow/Default/star.png" alt="" className="w-8 h-8" />
                  <div className="text-6xl md:text-8xl">🕵️‍♂️</div>
                  <img src="/Assets/PNG/Blue/Default/star.png" alt="" className="w-8 h-8" />
                </div>
                <h3 className="font-fredoka text-3xl md:text-5xl text-white mb-4">IMPOSTOR</h3>
                <p className="font-comfortaa text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto">
                  Um jogo de <strong className="text-playzenha-yellow">dedução social</strong> onde você precisa descobrir quem está mentindo 
                  na roda antes que ele descubra qual é o tema secreto. Prepare-se para muitas risadas, 
                  discussões acaloradas e momentos de pura tensão!
                </p>

                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  <span className="bg-playzenha-yellow/20 text-playzenha-yellow px-4 py-2 rounded-full border border-playzenha-yellow/30 text-sm flex items-center gap-2">
                    <GameIcon type="checkmark" variant="outline" color="yellow" size="sm" />
                    3+ Jogadores
                  </span>
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full border border-white/30 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    5-15 min
                  </span>
                  <span className="bg-success-green/20 text-green-300 px-4 py-2 rounded-full border border-green-300/30 text-sm flex items-center gap-2">
                    <GameIcon type="star" variant="color" color="green" size="sm" />
                    Gratis
                  </span>
                </div>

                <GameButton
                  variant="primary"
                  size="lg"
                  onClick={() => onStartGame('impostor')}
                  className="w-full max-w-md mx-auto text-lg md:text-xl flex items-center justify-center gap-3 group shadow-lg"
                >
                  <GameIcon type="play" variant="dark" size="lg" />
                  <span className="font-fredoka">JOGAR IMPOSTOR AGORA</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </GameButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Planos de Pagamento */}
      <section id="planos" className="py-12 md:py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-fredoka text-3xl md:text-6xl text-white mb-6">
              Quanto custa jogar?
            </h2>
            <p className="font-comfortaa text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Escolha o plano ideal para sua turma e garante diversão ilimitada
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Gratuito",
                price: "R$ 0",
                period: "para sempre",
                popular: false,
                features: [
                  "3 jogos básicos",
                  "Até 6 jogadores",
                  "Partidas ilimitadas",
                  "Suporte via email"
                ],
                color: "border-gray-300"
              },
              {
                name: "Resenha",
                price: "R$ 19,90",
                period: "/ mês",
                popular: true,
                features: [
                  "10+ jogos exclusivos",
                  "Até 12 jogadores",
                  "Salas privadas",
                  "Histórico de partidas",
                  "Suporte prioritário",
                  "Novos jogos mensais"
                ],
                color: "border-playzenha-yellow"
              },
              {
                name: "Viral",
                price: "R$ 39,90", 
                period: "/ mês",
                popular: false,
                features: [
                  "Todos os jogos",
                  "Jogadores ilimitados",
                  "Customização total",
                  "Estatísticas avançadas",
                  "Criador de jogos",
                  "WhatsApp direto"
                ],
                color: "border-playzenha-blue"
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`bg-white rounded-3xl p-8 border-4 ${plan.color} relative ${
                  plan.popular ? 'scale-105' : ''
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: plan.popular ? 1.07 : 1.02 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-playzenha-yellow text-playzenha-blue px-6 py-2 rounded-full font-fredoka text-sm font-bold">
                      MAIS POPULAR
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="font-fredoka text-2xl text-gray-800 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-fredoka text-4xl text-gray-800">{plan.price}</span>
                    <span className="font-comfortaa text-gray-600">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="font-comfortaa text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <GameButton variant={plan.popular ? 'primary' : 'secondary'} className={`w-full py-4 px-6 text-lg font-bold`}>
                  {plan.price === "R$ 0" ? "JOGAR GRÁTIS" : "ASSINAR AGORA"}
                </GameButton>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="font-comfortaa text-gray-600 mb-4">
              Não quer assinar um plano? Compre créditos avulsos!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["10 partidas - R$ 4,90", "25 partidas - R$ 9,90", "50 partidas - R$ 17,90"].map((pack) => (
                <GameButton key={pack} variant="secondary" size="sm" className="border-2 border-gray-300 rounded-xl font-comfortaa text-gray-700 hover:border-playzenha-blue transition-colors">
                  {pack}
                </GameButton>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 text-white py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-playzenha-yellow rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-playzenha-blue" />
                </div>
                <span className="font-fredoka text-2xl">PLAYZENHA</span>
              </div>
              <p className="font-comfortaa text-gray-400 leading-relaxed">
                A forma mais fácil e divertida de jogar jogos sociais com seus amigos, 
                criando momentos épicos e muita resenha!
              </p>
            </div>

            <div>
              <h4 className="font-fredoka text-lg mb-6 text-playzenha-yellow">Siga-nos</h4>
              <div className="space-y-3">
                <a href="#" className="block font-comfortaa text-gray-400 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="block font-comfortaa text-gray-400 hover:text-white transition-colors">TikTok</a>
                <a href="#" className="block font-comfortaa text-gray-400 hover:text-white transition-colors">YouTube</a>
                <a href="#" className="block font-comfortaa text-gray-400 hover:text-white transition-colors">Discord</a>
              </div>
            </div>

            <div>
              <h4 className="font-fredoka text-lg mb-6 text-playzenha-yellow">Informações</h4>
              <div className="space-y-3">
                <a href="#" className="block font-comfortaa text-gray-400 hover:text-white transition-colors">Sobre nós</a>
                <a href="#" className="block font-comfortaa text-gray-400 hover:text-white transition-colors">Planos</a>
                <a href="#" className="block font-comfortaa text-gray-400 hover:text-white transition-colors">Blog</a>
                <a href="#" className="block font-comfortaa text-gray-400 hover:text-white transition-colors">Política de Privacidade</a>
                <a href="#" className="block font-comfortaa text-gray-400 hover:text-white transition-colors">Termos de Uso</a>
              </div>
            </div>

            <div>
              <h4 className="font-fredoka text-lg mb-6 text-playzenha-yellow">Contato</h4>
              <div className="space-y-3">
                <p className="font-comfortaa text-gray-400">contato@playzenha.com.br</p>
                <p className="font-comfortaa text-gray-400">(11) 99999-9999</p>
                <p className="font-comfortaa text-gray-400">São Paulo, SP</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center relative">
            {/* Decorative elements in footer */}
            <div className="absolute left-1/4 top-4 opacity-10">
              <img src="/Assets/PNG/Blue/Default/star_outline.png" alt="" className="w-6 h-6" />
            </div>
            <div className="absolute right-1/4 top-4 opacity-10">
              <img src="/Assets/PNG/Yellow/Default/star.png" alt="" className="w-5 h-5" />
            </div>
            <p className="font-comfortaa text-gray-400">
              © 2026 PlayZenha. Todos os direitos reservados. Feito com ❤️ no Brasil 🇧🇷
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage