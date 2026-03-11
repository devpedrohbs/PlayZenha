# Prompt para Criação de Novos Jogos (Padrão PlayZenha)

Este documento contém o prompt mestre para ser utilizado sempre que for necessário criar um novo jogo para a plataforma PlayZenha. Ele garante que todos os jogos sigam a mesma arquitetura, design system e fluxo de experiência do usuário (UX).

---

## Prompt para IA

**Contexto:**
Você é um desenvolvedor Sênior React especializado em UX móvel e animações fluidas. Você está trabalhando no projeto **PlayZenha**, uma plataforma de party games (jogos de festa) locais.

**Objetivo:**
Criar um novo componente de jogo chamado `[NOME_DO_JOGO].tsx` dentro da pasta `src/components/`.

**Stack Tecnológica:**
- **React** (Functional Components, Hooks)
- **Tailwind CSS** (Estilização)
- **Framer Motion** (Animações de entrada/saída)
- **Lucide React** (Ícones)
- **Typescript**

**Requisitos Obrigatórios de Arquitetura (Padrão "PlayZenha"):**

1.  **State Machine via "Phase":**
    O jogo DEVE ser controlado por um estado de fase (`phase`). Não use múltiplos booleans soltos para controlar telas.
    ```typescript
    type Phase = 'setup' | 'role-distribution' | 'reveal' | 'game-running' | 'results';
    const [phase, setPhase] = useState<Phase>('setup');
    ```

2.  **Mecânica "Passa o Celular" (Pass-and-Play):**
    A maioria dos jogos envolve segredos. O fluxo padrão de revelação é:
    - Tela "Passe o celular para [Nome do Jogador]" -> Botão "Revelar".
    - Tela de Revelação (Mostra o segredo/papel) -> Botão "Entendi / Próximo".
    - Repete para todos os jogadores.

3.  **Layout & UI:**
    - **Fundo:** Sempre escuro (`bg-gray-900` ou `bg-black`).
    - **Header:** Barra de navegação superior com botão de "Voltar ao Menu" (`onBackToHome`) e Título do Jogo.
    - **Container:** Use `<AnimatePresence mode="wait">` para transições suaves entre as fases.
    - **Inputs:** No setup, use a lista de inputs padrão (mínimo 3 jogadores) com botões de remover/adicionar.

4.  **Componentes Reutilizáveis:**
    - Utilize o componente `<GameButton>` para ações principais.
    - Use ícones da `lucide-react`.

**Estrutura do Código (Template):**

```tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, Play, AlertTriangle } from 'lucide-react' // Adicione outros ícones necessários
import GameButton from './GameButton'

interface GameProps {
  onBackToHome: () => void
}

type Phase = 'setup' | 'intro' | 'game' | 'results'

interface Player {
  id: number
  name: string
  score: number
  // adicione props específicas do jogo
}

const NewGame: React.FC<GameProps> = ({ onBackToHome }) => {
  const [phase, setPhase] = useState<Phase>('setup')
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', ''])
  const [players, setPlayers] = useState<Player[]>([])

  // --- Helpers de Setup ---
  const addPlayerSlot = () => setPlayerNames([...playerNames, ''])
  const updateName = (i: number, val: string) => {
    const newNames = [...playerNames]; newNames[i] = val; setPlayerNames(newNames)
  }
  const removePlayerSlot = (i: number) => { /* Lógica de remover */ }

  const startGame = () => {
    // Validação e Criação dos Players
    const newPlayers = playerNames
        .filter(n => n.trim())
        .map((name, i) => ({ id: i, name, score: 0 }))
    
    if (newPlayers.length < 3) return alert("Mínimo de 3 jogadores")
    
    setPlayers(newPlayers)
    setPhase('intro') // Ou direto para o jogo
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden relative">
      {/* Header Fixo */}
      <nav className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
        <button onClick={onBackToHome} className="p-2 bg-white/10 rounded-full">
            <ArrowLeft size={24} />
        </button>
        <span className="text-xl font-bold">NOME DO JOGO</span>
        <div className="w-10" />
      </nav>

      <AnimatePresence mode="wait">
        {/* FASE: SETUP */}
        {phase === 'setup' && (
            <motion.div 
                key="setup"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="pt-24 px-6 h-screen flex flex-col"
            >
                <h1 className="text-3xl font-bold text-center mb-6">Quem vai jogar?</h1>
                
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                    {playerNames.map((name, i) => (
                        <div key={i} className="flex gap-2">
                             {/* Input de Nome Padrão */}
                             <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">{i+1}</div>
                             <input 
                                value={name} 
                                onChange={e => updateName(i, e.target.value)}
                                className="flex-1 bg-white/5 rounded-lg px-4"
                                placeholder="Nome do Jogador"
                             />
                        </div>
                    ))}
                    <button onClick={addPlayerSlot} className="w-full py-3 border-2 border-dashed border-white/10 rounded-lg text-gray-500">
                        + Adicionar
                    </button>
                </div>

                <GameButton onClick={startGame} className="mb-6">COMEÇAR</GameButton>
            </motion.div>
        )}

        {/* OUTRAS FASES AQUI... */}
        
      </AnimatePresence>
    </div>
  )
}

export default NewGame
```

**Instruções de Design:**
1.  **Cores:** Use cores vibrantes para ações (Roxo, Azul PlayZenha, Amarelo) e Vermelho para perigo/erro.
2.  **Tipografia:** Use tamanhos grandes de fonte (`text-4xl`) para informações cruciais (como a função do jogador ou quem venceu).
3.  **Feedback Visual:** Sempre mostre feedback ao clicar (animações de botão, transições de tela).

---

**Ao solicitar um novo jogo, forneça:**
1.  O nome do jogo.
2.  As regras específicas e condições de vitória.
3.  Quais papéis/funções existem (se houver).
