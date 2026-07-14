import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppSettings } from '../hooks/useAppSettings'

export default function Register() {
  const { signUp } = useAuth()
  const { registrationEnabled, loading: settingsLoading } = useAppSettings()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { data, error } = await signUp(email, password)
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.session) {
      navigate('/', { replace: true })
    } else {
      setCheckEmail(true)
    }
  }

  if (checkEmail) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
        <h1 className="font-display text-2xl font-medium text-ink">Check your email</h1>
        <p className="text-sm text-ink/50 max-w-xs">
          We sent a confirmation link to <span className="font-medium text-ink/70">{email}</span>. Confirm it, then
          come back and log in.
        </p>
        <Link to="/login" className="mt-4 text-accent font-medium">
          Back to login
        </Link>
      </div>
    )
  }

  if (settingsLoading) return null

  if (!registrationEnabled) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
        <h1 className="font-display text-2xl font-medium text-ink">Registration is currently closed</h1>
        <p className="text-sm text-ink/50 max-w-xs">
          New accounts aren't being accepted right now. Check back later, or ask whoever runs this
          instance to open it back up.
        </p>
        <Link to="/login" className="mt-4 text-accent font-medium">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-8 py-10">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-medium text-ink">Nihongo Path</h1>
        <p className="text-sm text-ink/45 mt-2">Create your account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full text-base py-4 px-4 rounded-2xl border-2 border-ink/10 focus:outline-none focus:border-accent"
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min. 6 characters)"
          className="w-full text-base py-4 px-4 rounded-2xl border-2 border-ink/10 focus:outline-none focus:border-accent"
        />

        {error && <p className="text-sm text-danger text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-accent text-white font-medium text-lg active:scale-[0.98] active:opacity-90 transition-transform disabled:opacity-50 mt-2"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-ink/45 text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent">
          Log in
        </Link>
      </p>
    </div>
  )
}
