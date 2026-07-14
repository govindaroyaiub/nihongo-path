import { Navigate, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAppSettings } from '../hooks/useAppSettings'

export default function Admin() {
  const { isAdmin, loading: authLoading } = useAuth()
  const { registrationEnabled, loading: settingsLoading, setRegistrationEnabled } = useAppSettings()
  const navigate = useNavigate()

  if (authLoading) return null
  if (!isAdmin) return <Navigate to="/" replace />

  async function toggle() {
    await setRegistrationEnabled(!registrationEnabled)
  }

  return (
    <div className="flex-1 flex flex-col px-6 pt-6 pb-6">
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Back to home"
        className="flex items-center justify-center -ml-2 -mt-1 mb-4 w-10 h-10 rounded-full text-ink/50 active:bg-ink/5 active:text-ink/80"
      >
        <ChevronLeft size={24} />
      </button>

      <h1 className="font-display text-2xl font-medium text-ink mb-8">Admin</h1>

      <div className="flex items-center justify-between gap-4 py-4 border-t border-b border-ink/[0.07]">
        <div>
          <p className="font-medium text-ink">Allow new registrations</p>
          <p className="text-xs text-ink/40 mt-0.5">
            {registrationEnabled ? 'Anyone can create an account' : 'Registration is closed to new users'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={registrationEnabled}
          disabled={settingsLoading}
          onClick={toggle}
          className={`relative shrink-0 w-12 h-7 rounded-full transition-colors disabled:opacity-50 ${
            registrationEnabled ? 'bg-accent' : 'bg-ink/15'
          }`}
        >
          <span
            className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform"
            style={{ transform: registrationEnabled ? 'translateX(20px)' : 'translateX(0)' }}
          />
        </button>
      </div>
    </div>
  )
}
