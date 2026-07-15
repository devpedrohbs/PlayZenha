import { useEffect, useRef, useState } from 'react'
import { appEnv } from '../../../app/env'

interface GoogleCredentialResponse {
  credential?: string
}

interface GoogleButtonProps {
  mode: 'login' | 'signup'
  disabled?: boolean
  onCredential: (credential: string) => void
  onError: (message: string) => void
}

interface GoogleIdentityApi {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string
        callback: (response: GoogleCredentialResponse) => void
      }) => void
      renderButton: (
        parent: HTMLElement,
        options: Record<string, string | number>
      ) => void
    }
  }
}

declare global {
  interface Window {
    google?: GoogleIdentityApi
  }
}

let googleScriptPromise: Promise<void> | null = null

export function GoogleSignInButton({
  mode,
  disabled = false,
  onCredential,
  onError
}: GoogleButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(onCredential)
  const errorRef = useRef(onError)
  const [ready, setReady] = useState(false)

  callbackRef.current = onCredential
  errorRef.current = onError

  useEffect(() => {
    if (!appEnv.googleClientId) return undefined

    let active = true

    void loadGoogleIdentityServices()
      .then(() => {
        if (!active || !buttonRef.current || !window.google) return

        window.google.accounts.id.initialize({
          client_id: appEnv.googleClientId,
          callback: ({ credential }) => {
            if (!credential) {
              errorRef.current('O Google nao retornou uma credencial valida.')
              return
            }
            callbackRef.current(credential)
          }
        })

        buttonRef.current.replaceChildren()
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: mode === 'signup' ? 'signup_with' : 'signin_with',
          shape: 'pill',
          logo_alignment: 'left',
          locale: 'pt-BR',
          width: Math.min(400, Math.max(240, buttonRef.current.clientWidth))
        })
        setReady(true)
      })
      .catch(() => {
        if (active) {
          errorRef.current('Nao foi possivel carregar o login do Google.')
        }
      })

    return () => {
      active = false
    }
  }, [mode])

  if (!appEnv.googleClientId) {
    return (
      <button
        className="auth-page-google-unavailable"
        type="button"
        disabled
        title="Configure VITE_GOOGLE_CLIENT_ID para habilitar o Google"
      >
        <GoogleBrandMark />
        <span>Continuar com</span>
        <span className="auth-page-google-word" aria-label="Google">
          <span className="blue">G</span>
          <span className="red">o</span>
          <span className="yellow">o</span>
          <span className="blue">g</span>
          <span className="green">l</span>
          <span className="red">e</span>
        </span>
      </button>
    )
  }

  return (
    <div
      className={`auth-page-google-button ${disabled || !ready ? 'disabled' : ''}`}
      aria-busy={!ready}
    >
      <div ref={buttonRef} />
    </div>
  )
}

function GoogleBrandMark() {
  return (
    <svg
      className="auth-page-google-mark"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.87A6.02 6.02 0 0 1 6.07 12c0-.65.11-1.28.32-1.87V7.52H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.48l3.35-2.61Z"
      />
      <path
        fill="#EA4335"
        d="M12 6c1.47 0 2.79.5 3.82 1.5l2.88-2.88A9.66 9.66 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.61C7.18 7.76 9.39 6 12 6Z"
      />
    </svg>
  )
}

function loadGoogleIdentityServices(): Promise<void> {
  if (window.google) return Promise.resolve()
  if (googleScriptPromise) return googleScriptPromise

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-playzenha-google-identity]'
    )

    const script = existing ?? document.createElement('script')
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('Google script failed')), {
      once: true
    })

    if (!existing) {
      script.src = 'https://accounts.google.com/gsi/client?hl=pt-BR'
      script.async = true
      script.defer = true
      script.dataset.playzenhaGoogleIdentity = 'true'
      document.head.appendChild(script)
    }
  })

  return googleScriptPromise
}
