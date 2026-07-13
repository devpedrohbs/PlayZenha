import React from 'react'
import { Gamepad2 } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-playzenha-surface/60 py-10">
      <div className="section-container flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-playzenha-yellow text-dark-bg">
            <Gamepad2 className="h-5 w-5" />
          </span>
          <div>
            <p className="font-fredoka text-xl text-white">PlayZenha</p>
            <p className="text-sm text-playzenha-muted">Jogos para resenhas inesquecíveis.</p>
          </div>
        </div>
        <p className="text-sm text-playzenha-muted">© 2026 PlayZenha. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
