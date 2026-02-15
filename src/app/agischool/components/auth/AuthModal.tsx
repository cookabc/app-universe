import { useState } from 'react'
import { Modal } from '../common/Modal'
import { ComingSoon } from '../common/ComingSoon'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Log In' : 'Sign Up'}>
      {/* Tabs */}
      <div className="flex border-b border-[#e8e8f3] dark:border-gray-800">
        <button 
          onClick={() => setMode('login')}
          className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${
            mode === 'login' 
              ? 'text-primary border-b-2 border-primary bg-primary/5' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          Log In
        </button>
        <button 
          onClick={() => setMode('register')}
          className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${
            mode === 'register' 
              ? 'text-primary border-b-2 border-primary bg-primary/5' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Content */}
      <div className="p-6 min-h-[300px] flex items-center justify-center">
        <ComingSoon 
          title={mode === 'login' ? "Welcome Back" : "Create Account"} 
          description={mode === 'login' 
            ? "Authentication features are currently under development." 
            : "User registration features are currently under development."
          } 
        />
      </div>
    </Modal>
  )
}
