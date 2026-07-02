import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, Lock, Mail, Chrome, Eye, EyeOff } from 'lucide-react'
import GameButton from './GameButton'

interface LoginPageProps {
  onBackToHome: () => void
}

type AuthMode = 'login' | 'register'

const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome }) => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement authentication logic here
    console.log('Auth submit:', { mode, email, password, name })
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white font-comfortaa flex items-center justify-center relative overflow-hidden px-4">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-playzenha-blue/10 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-playzenha-yellow/5 blur-[150px] rounded-full animate-float-delayed" />
      </div>

      {/* Back Button */}
      <button 
        onClick={onBackToHome}
        className="absolute top-6 left-6 z-50 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors group"
      >
        <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-white" />
      </button>

      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-playzenha-yellow to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-3">
                <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-fredoka text-3xl md:text-4xl text-white mb-2">
                {mode === 'login' ? 'Bem-vindo de volta!' : 'Criar sua conta'}
            </h1>
            <p className="text-gray-400 text-sm">
                {mode === 'login' 
                    ? 'Entre para continuar sua jornada no PlayZenha.' 
                    : 'Registre-se e comece a competir com seus amigos.'}
            </p>
        </div>

        <motion.div 
            layout
            className="glass-panel p-8 rounded-3xl border border-white/10 bg-dark-blue/30 backdrop-blur-xl shadow-2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <AnimatePresence mode="popLayout">
                    {mode === 'register' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1"
                        >
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nome</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-playzenha-yellow transition-colors" />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-playzenha-yellow/50 focus:outline-none transition-all placeholder-gray-600"
                                    placeholder="Seu nome de jogador"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-playzenha-blue transition-colors" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-dark-bg/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-playzenha-blue/50 focus:outline-none transition-all placeholder-gray-600"
                            placeholder="seu@email.com"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Senha</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-playzenha-yellow transition-colors" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-dark-bg/50 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white focus:border-playzenha-yellow/50 focus:outline-none transition-all placeholder-gray-600"
                            placeholder="••••••••"
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {mode === 'login' && (
                    <div className="flex justify-end">
                        <a href="#" className="text-xs text-playzenha-yellow/80 hover:text-playzenha-yellow transition-colors">
                            Esqueceu a senha?
                        </a>
                    </div>
                )}

                <GameButton 
                    variant="primary" 
                    className="w-full justify-center mt-6 shadow-lg shadow-playzenha-yellow/20"
                    size="lg"
                >
                    {mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
                </GameButton>

            </form>

            <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-gray-500 bg-dark-bg/50 backdrop-blur-sm rounded">Ou continue com</span>
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-colors bg-white/5 w-full">
                    <Chrome className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-sm font-medium">Continuar com Google</span>
                </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-400">
                {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <button 
                    onClick={toggleMode}
                    className="ml-2 font-bold text-playzenha-yellow hover:underline transition-all"
                >
                    {mode === 'login' ? 'Registre-se' : 'Faça Login'}
                </button>
            </p>

        </motion.div>

      </div>
    </div>
  )
}

export default LoginPage
