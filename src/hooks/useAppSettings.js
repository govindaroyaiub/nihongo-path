import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

// Reads/writes the single global row in `app_settings`. Only admins can
// actually change it — RLS rejects the update for everyone else.
export function useAppSettings() {
  const [registrationEnabled, setRegistrationEnabledState] = useState(true)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('app_settings').select('registration_enabled').eq('id', true).single()

    if (!error && data) setRegistrationEnabledState(data.registration_enabled)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function setRegistrationEnabled(value) {
    const { error } = await supabase.from('app_settings').update({ registration_enabled: value }).eq('id', true)

    if (!error) setRegistrationEnabledState(value)
    return { error }
  }

  return { registrationEnabled, loading, setRegistrationEnabled, reload: load }
}
