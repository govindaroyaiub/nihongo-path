import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppSettings } from '../hooks/useAppSettings'

export default function Login() {
  const { signIn } = useAuth()
  const { registrationEnabled } = useAppSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate(location.state?.from ?? '/', { replace: true })
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-8 py-10">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-medium text-ink">Nihongo Path</h1>
        <p className="text-sm text-ink/45 mt-2">Welcome back</p>
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full text-base py-4 px-4 rounded-2xl border-2 border-ink/10 focus:outline-none focus:border-accent"
        />

        {error && <p className="text-sm text-danger text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-accent text-white font-medium text-lg active:scale-[0.98] active:opacity-90 transition-transform disabled:opacity-50 mt-2"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      {registrationEnabled && (
        <p className="text-sm text-ink/45 text-center mt-6">
          Need an account?{' '}
          <Link to="/register" className="font-medium text-accent">
            Register
          </Link>
        </p>
      )}
    </div>
  )
}
