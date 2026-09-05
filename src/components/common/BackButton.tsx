import { ArrowLeft } from 'lucide-react'
import { useStore } from '../../store/useStore'

interface Props {
  className?: string
  label?: string
  variant?: 'ghost' | 'solid' | 'minimal'
}

export default function BackButton({ className = '', label, variant = 'ghost' }: Props) {
  const { view, goBack, viewHistory } = useStore()
  
  // Don't show on landing if no history
  if (view === 'landing' && viewHistory.length === 0) return null

  const canGoBack = viewHistory.length > 0

  const baseStyles = variant === 'solid'
    ? 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] border border-[var(--border)]'
    : variant === 'minimal'
    ? 'hover:bg-[var(--bg-hover)]'
    : 'hover:bg-[var(--bg-hover)] hover:text-white text-gray-400'

  return (
    <button
      onClick={() => canGoBack ? goBack() : useStore.getState().setView('landing')}
      disabled={!canGoBack && view === 'landing'}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${baseStyles} ${!canGoBack && view !== 'landing' ? 'opacity-50' : ''} ${className}`}
      title={canGoBack ? `Back to ${viewHistory[viewHistory.length-1]}` : 'Back to Home'}
    >
      <ArrowLeft size={16} />
      {label && <span>{label}</span>}
      {variant !== 'minimal' && !label && <span className="hidden sm:inline">Back</span>}
    </button>
  )
}
