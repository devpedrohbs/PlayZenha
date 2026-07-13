import React from 'react'

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

const AppShell: React.FC<AppShellProps> = ({ children, className = '' }) => {
  return (
    <div className={`page-shell relative ${className}`}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-18rem] top-[-18rem] h-[34rem] w-[34rem] rounded-full bg-playzenha-blue/20 blur-[120px]" />
        <div className="absolute right-[-16rem] top-[28rem] h-[28rem] w-[28rem] rounded-full bg-playzenha-yellow/10 blur-[120px]" />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default AppShell
