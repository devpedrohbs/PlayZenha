import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameView } from '../App'
import { Users, Zap, ArrowRight, Clock, Gamepad2, Trophy, Coins, Star, Crown, Moon, BookOpen, X } from 'lucide-react'
import GameButton from './GameButton'
import GameIcon from './GameIcon'

interface HomePageProps {
  onStartGame: (game: GameView) => void
}

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  const [showRules, setShowRules] = useState<'impostor' | 'ultima-noite' | null>(null)
  return (
    <div className="min-h-screen bg-dark-bg text-white font-comfortaa overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-playzenha-blue/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-playzenha-yellow/10 blur-[120px] rounded-full animate-float-delayed" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 z-50 glass-panel border-b border-white/10 px-4 py-3 md:px-6 md:py-4 mt-2 mx-2 md:mt-4 md:mx-auto max-w-7xl rounded-2xl md:rounded-2xl left-0 right-0 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
             <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <img src="/Assets/PNG/Yellow/Default/star.png" className="absolute w-full h-full animate-spin-slow opacity-80" alt="Logo Star" />
                <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-white relative z-10" />
             </div>
             <span className="font-fredoka text-xl md:text-2xl tracking-wide text-white">PlayZenha</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#gamificacao" className="hover:text-playzenha-yellow transition-colors font-bold text-sm uppercase tracking-wider">Rankings</a>
            <a href="#jogos" className="hover:text-playzenha-yellow transition-colors font-bold text-sm uppercase tracking-wider">Jogos</a>
            
            <div className="w-px h-6 bg-white/20 mx-2" />
            
            <button 
                onClick={() => onStartGame('login')}
                className="text-white hover:text-playzenha-yellow font-bold text-sm transition-colors"
            >
                Entrar
            </button>
            <GameButton variant="primary" size="sm" onClick={() => onStartGame('login')}>
              CRIAR CONTA
            </GameButton>
          </div>

          {/* Mobile CTA */}
          <div className="md:hidden flex items-center gap-3">
             <button 
                onClick={() => onStartGame('login')}
                className="text-xs font-bold text-white/80"
             >
                Entrar
             </button>
            <GameButton variant="primary" size="sm" onClick={() => onStartGame('login')} className="text-xs px-3 py-1.5 shadow-sm">
              CRIAR CONTA
            </GameButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 z-10">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12">
          
          {/* Text Content */}
          <motion.div 
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6 hover:bg-white/20 transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
              <span className="text-sm font-bold text-playzenha-yellow">+2.4k Jogadores Online</span>
            </div>
            
            <h1 className="font-fredoka text-5xl md:text-7xl leading-tight mb-6 text-white drop-shadow-lg px-2 md:px-0">
              A Resenha virou <br />
              <span className="text-playzenha-yellow drop-shadow-md">COMPETIÇÃO</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
              Junte seus amigos, aposte <strong>Zenhas</strong> e suba no ranking global. 
              A plataforma definitiva de jogos de tabuleiro e cartas online.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <GameButton variant="primary" size="lg" onClick={() => document.getElementById('jogos')?.scrollIntoView({ behavior: 'smooth' })} className="group flex items-center gap-3 shadow-lg hover:shadow-playzenha-yellow/20">
                <GameIcon type="play" variant="dark" size="md" />
                <span>COMEÇAR A JOGAR</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </GameButton>
              
              <button className="flex items-center gap-2 px-6 py-4 rounded-xl glass-button text-white font-bold hover:bg-white/20 transition-all border border-white/10">
                <img src="/Assets/PNG/Blue/Default/icon_circle.png" className="w-6 h-6" alt="Icon" />
                <span>Ver Rankings</span>
              </button>
            </div>
          </motion.div>

          {/* Gamified Visual */}
          <motion.div 
            className="flex-1 w-full max-w-md mx-auto relative perspective-1000"
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
             {/* Decorative Elements */}
             <motion.img 
                src="/Assets/PNG/Yellow/Default/star.png" 
                className="absolute -top-10 -right-10 w-24 h-24 z-20 drop-shadow-lg filter brightness-110"
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
             />
             <motion.img 
                src="/Assets/PNG/Blue/Default/star_outline.png" 
                className="absolute bottom-0 -left-10 w-20 h-20 z-0 opacity-50"
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
             />

             {/* Main Card */}
             <div className="glass-panel p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-2xl backdrop-blur-xl rounded-2xl sm:rounded-3xl">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10 border-b border-white/10 pb-6 text-center sm:text-left">
                    <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-playzenha-blue to-purple-500 border-4 border-white/20 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                        <span className="text-4xl sm:text-3xl filter drop-shadow">😎</span>
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="font-fredoka text-2xl sm:text-xl text-white mb-1 sm:mb-0">Mestre da Resenha</h3>
                        <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                          <span className="text-xs font-bold text-dark-bg bg-playzenha-yellow px-2 py-0.5 rounded-full shadow-lg shadow-playzenha-yellow/20">NÍVEL 42</span>
                          <span className="text-sm text-gray-300 font-medium">Ouro I</span>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto sm:ml-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center bg-white/5 sm:bg-transparent rounded-xl p-3 sm:p-0 gap-3 sm:gap-0 mt-2 sm:mt-0 border border-white/5 sm:border-none">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest sm:hidden pl-2">Saldo</span>
                        <div className="flex flex-col sm:items-end">
                            <div className="flex items-center gap-1.5 text-playzenha-yellow font-bold text-xl sm:text-lg drop-shadow-sm">
                                <img src="/Assets/PNG/Yellow/Default/icon_circle.png" className="w-6 h-6 sm:w-5 sm:h-5 shadow-sm" />
                                <span>15,400</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">Zenhas</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    {/* Rank Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs uppercase tracking-wider font-bold text-gray-400">
                            <span className="flex items-center gap-2">
                                <Trophy className="w-3 h-3 text-playzenha-yellow" />
                                Próximo Rank: Diamante
                            </span>
                            <span className="text-playzenha-blue">85%</span>
                        </div>
                        <div className="h-3 w-full bg-dark-bg/60 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div className="h-full bg-gradient-to-r from-playzenha-blue to-cyan-400 w-[85%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>
                    </div>

                    {/* Active Quest */}
                    <div className="bg-gradient-to-r from-playzenha-blue/20 to-transparent rounded-xl p-4 border border-playzenha-blue/30 flex items-start gap-4 hover:bg-playzenha-blue/30 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg bg-playzenha-blue/40 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-white mb-1">Vença 3 partidas de Truco</p>
                            <p className="text-xs text-gray-300">Recompensa: <span className="text-playzenha-yellow font-bold">500 Zenhas</span></p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                     <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest transition-colors">
                        Ver Perfil Completo
                     </button>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Gamification Features Grid */}
      <section id="gamificacao" className="py-24 relative bg-dark-bg/50">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="text-center mb-16">
                <span className="text-playzenha-blue font-bold tracking-[0.2em] text-sm uppercase bg-playzenha-blue/10 px-4 py-2 rounded-full border border-playzenha-blue/20">Sistema de Progressão</span>
                <h2 className="font-fredoka text-4xl py-6 text-white">Jogue mais, Ganhe mais</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Nossa plataforma recompensa cada vitória e cada interação.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        title: "Apostas P2P",
                        desc: "Desafie seus amigos valendo Zenhas. Quem perder paga a conta (virtual)!",
                        icon: <Coins className="w-8 h-8 text-playzenha-yellow" />,
                        bg: "to-yellow-600/5",
                        border: "border-yellow-500/20 hover:border-playzenha-yellow/50"
                    },
                    {
                        title: "Rankings Semanais",
                        desc: "Suba de divisão e ganhe molduras exclusivas e skins para seu avatar.",
                        icon: <Crown className="w-8 h-8 text-playzenha-blue" />,
                        bg: "to-blue-600/5",
                        border: "border-blue-500/20 hover:border-playzenha-blue/50"
                    },
                    {
                        title: "Conquistas",
                        desc: "Desbloqueie badges raras por feitos épicos durante as partidas.",
                        icon: <Star className="w-8 h-8 text-purple-400" />,
                        bg: "to-purple-600/5",
                        border: "border-purple-500/20 hover:border-purple-400/50"
                    }
                ].map((item, idx) => (
                    <motion.div 
                        key={idx}
                        className={`glass-panel p-8 bg-gradient-to-br from-white/5 ${item.bg} ${item.border} hover:-translate-y-2 transition-all duration-300 group cursor-default`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg border border-white/5">
                            {item.icon}
                        </div>
                        <h3 className="font-fredoka text-2xl mb-3 text-white group-hover:text-playzenha-yellow transition-colors">{item.title}</h3>
                        <p className="text-gray-400 leading-relaxed font-light">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Games List Section */}
      <section id="jogos" className="py-20 relative">
        <div className="container mx-auto px-6 max-w-7xl">
             <div className="text-center mb-16">
                <span className="text-playzenha-yellow font-bold tracking-[0.2em] text-sm uppercase bg-playzenha-yellow/10 px-4 py-2 rounded-full border border-playzenha-yellow/20">Biblioteca de Jogos</span>
                <h2 className="font-fredoka text-4xl py-6 text-white">Escolha sua Resenha</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Impostor Game Card */}
                <div className="group relative bg-gradient-to-br from-playzenha-blue/10 to-dark-blue/50 rounded-[2rem] p-8 border border-white/10 overflow-hidden hover:border-playzenha-yellow/50 transition-all duration-300 hover:-translate-y-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12">
                        <Users className="w-32 h-32 text-playzenha-blue" />
                    </div>
                    
                    <div className="relative z-10">
                        <span className="bg-playzenha-blue text-white font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider mb-4 inline-block">Dedução Social</span>
                        <h3 className="font-fredoka text-3xl mb-4 text-white group-hover:text-playzenha-blue transition-colors">Impostor</h3>
                        <p className="text-gray-300 mb-6 leading-relaxed min-h-20">
                            Descubra quem é o mentiroso na roda! Um clássico para grupos, onde você deve encontrar o impostor antes que o tempo acabe.
                        </p>
                        
                        <div className="flex gap-4 mb-4 text-sm font-bold text-gray-400">
                             <div className="flex items-center gap-2"><Users className="w-4 h-4" /> 3-12 Jogadores</div>
                             <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 10 min</div>
                        </div>

                        <div className="flex gap-2">
                            <GameButton variant="primary" onClick={() => onStartGame('impostor')} className="flex-1 shadow-lg group-hover:shadow-playzenha-blue/30">
                                JOGAR
                            </GameButton>
                            <button onClick={() => setShowRules('impostor')} className="px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-gray-400 transition-colors" title="Regras">
                                <BookOpen className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ultima Noite Game Card */}
                <div className="group relative bg-gradient-to-br from-purple-900/20 to-black/50 rounded-[2rem] p-8 border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:-rotate-12">
                        <Moon className="w-32 h-32 text-purple-500" />
                    </div>
                    
                    <div className="relative z-10">
                        <span className="bg-purple-600 text-white font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider mb-4 inline-block">Estratégia & Bluff</span>
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="font-fredoka text-3xl text-white group-hover:text-purple-400 transition-colors">Última Noite</h3>
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">NOVO</span>
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed min-h-20">
                            Lobos, Anjos e Detetives! Uma noite de mistério onde ninguém é quem diz ser. Sobreviva à noite e descubra os lobos.
                        </p>
                        
                        <div className="flex gap-4 mb-4 text-sm font-bold text-gray-400">
                             <div className="flex items-center gap-2"><Users className="w-4 h-4" /> 6+ Jogadores</div>
                             <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 15 min</div>
                        </div>

                        <div className="flex gap-2">
                            <GameButton variant="secondary" onClick={() => onStartGame('ultima-noite')} className="flex-1 shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 border-purple-500/30 text-white">
                                JOGAR
                            </GameButton>
                            <button onClick={() => setShowRules('ultima-noite')} className="px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-gray-400 transition-colors" title="Regras">
                                <BookOpen className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 mt-20 relative bg-black/20">
        <div className="container mx-auto px-6 text-center">
             <div className="flex items-center justify-center gap-2 mb-4">
                <Gamepad2 className="w-6 h-6 text-playzenha-yellow" />
                <span className="font-fredoka text-2xl text-white">PlayZenha</span>
             </div>
             <p className="text-gray-500 text-sm mb-8">© 2026 PlayZenha Inc. - Todos os direitos reservados.</p>
             <div className="flex justify-center gap-8 text-sm font-bold tracking-wide">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">TERMOS</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">PRIVACIDADE</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">SUPORTE</a>
                        </div>
                   </div>
      </footer>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRules(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 border-b border-white/5 flex justify-between items-center ${
                showRules === 'impostor' ? 'bg-playzenha-blue/10' : 'bg-purple-900/20'
              }`}>
                <div className="flex items-center gap-3">
                  {showRules === 'impostor' ? (
                    <div className="p-2 bg-playzenha-blue rounded-xl">
                      <Zap size={24} className="text-white" />
                    </div>
                  ) : (
                    <div className="p-2 bg-purple-600 rounded-xl">
                      <Moon size={24} className="text-white" />
                    </div>
                  )}
                  <h2 className="text-2xl font-fredoka font-bold">
                    {showRules === 'impostor' ? 'Regras: Impostor' : 'Regras: Última Noite'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowRules(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto space-y-8 text-gray-300 leading-relaxed custom-scrollbar">
                {showRules === 'impostor' ? (
                  <>
                    <section>
                      <h3 className="text-playzenha-blue font-bold text-lg mb-3 flex items-center gap-2">
                        <Trophy size={18} /> Objetivo
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong className="text-white">Civis:</strong> Descobrir quem é o impostor e votar nele.</li>
                        <li><strong className="text-white">Impostor:</strong> Enganar os outros e descobrir a palavra secreta.</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-playzenha-blue font-bold text-lg mb-3 flex items-center gap-2">
                        <Gamepad2 size={18} /> Como Jogar
                      </h3>
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>Todos recebem uma palavra secreta, exceto o Impostor (que só vê "IMPOSTOR").</li>
                        <li>Em cada rodada, cada jogador diz uma palavra relacionada à palavra secreta.</li>
                        <li>O Impostor deve tentar se misturar dando uma dica vaga ou copiando os outros.</li>
                        <li>Após a rodada de dicas, todos votam em quem acham que é o Impostor.</li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="text-playzenha-blue font-bold text-lg mb-3 flex items-center gap-2">
                        <Zap size={18} /> Dicas
                      </h3>
                      <p>Seja sutil! Se sua dica for muito óbvia, o Impostor descobrirá a palavra secreta facilmente.</p>
                    </section>
                  </>
                ) : (
                  <>
                     <section>
                      <h3 className="text-purple-400 font-bold text-lg mb-3 flex items-center gap-2">
                        <Trophy size={18} /> Objetivo
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong className="text-white">Cidadãos:</strong> Identificar e eliminar os Lobos através da votação.</li>
                        <li><strong className="text-white">Lobos:</strong> Sobreviver à votação e eliminar os cidadãos à noite.</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-purple-400 font-bold text-lg mb-3 flex items-center gap-2">
                        <Gamepad2 size={18} /> Como Jogar (Fases)
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white mb-1">1. A Noite</h4>
                            <p className="text-sm">Todos fecham os olhos. O app chamará os papéis especiais (Lobo, Anjo, Detetive) para acordarem e realizarem suas ações em segredo.</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white mb-1">2. O Dia</h4>
                            <p className="text-sm">Todos acordam. Discutam quem vocês acham que são os Lobos com base nas pistas (ou mentiras!).</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white mb-1">3. Votação</h4>
                            <p className="text-sm">Ao final do tempo, todos votam. Quem tiver mais votos é eliminado e revela sua identidade.</p>
                        </div>
                      </div>
                    </section>

                     <section>
                      <h3 className="text-purple-400 font-bold text-lg mb-3 flex items-center gap-2">
                        <Star size={18} /> Papéis Especiais
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <li className="bg-white/5 p-2 rounded"><strong className="text-red-400">Lobo:</strong> Acorda à noite para eliminar um jogador. Se conhecem.</li>
                        <li className="bg-white/5 p-2 rounded"><strong className="text-blue-400">Anjo:</strong> Escolhe alguém para proteger do ataque dos lobos.</li>
                        <li className="bg-white/5 p-2 rounded"><strong className="text-yellow-400">Detetive:</strong> Pode investigar a identidade de um jogador suspeito.</li>
                        <li className="bg-white/5 p-2 rounded"><strong className="text-gray-400">Cidadão:</strong> Não tem poderes especiais, mas deve descobrir quem são os lobos.</li>
                      </ul>
                    </section>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePage
