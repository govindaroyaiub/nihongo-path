import { useEffect, useState } from 'react'
import { Volume2, Check } from 'lucide-react'
import { useStore, updateSettings, resetAll } from '../lib/store'
import { japaneseVoices, loadAudioManifest, clipCount, speak } from '../lib/speech'
import ConfirmDialog from '../components/ConfirmDialog'

const SAMPLE = 'はじめまして。わたしは にほんごの がくせいです。'

export default function Settings() {
  const settings = useStore((s) => s.settings)
  const [voices, setVoices] = useState(japaneseVoices())
  const [clips, setClips] = useState(clipCount())
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    loadAudioManifest().then(() => setClips(clipCount()))
    const refresh = () => setVoices(japaneseVoices())
    window.speechSynthesis?.addEventListener?.('voiceschanged', refresh)
    refresh()
    return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', refresh)
  }, [])

  const activeVoice = voices.find((v) => v.voiceURI === settings.voiceURI) ?? voices[0]

  return (
    <div className="pt-[max(env(safe-area-inset-top),1.5rem)] pb-10">
      <h1 className="font-title text-3xl">Settings <span className="text-grape">設定</span></h1>

      <Section title="Voice">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-bold">Natural voice clips</p>
              <p className="text-xs text-ink/45 mt-0.5">
                {clips > 0 ? `${clips} recorded clips installed. Used first, on every device.` : 'No clips installed yet. Using your device voice below.'}
              </p>
            </div>
            <span className={`text-xs font-extrabold px-2 py-1 rounded-full ${clips > 0 ? 'bg-success-soft text-success' : 'bg-ink/5 text-ink/40'}`}>
              {clips > 0 ? 'On' : 'Off'}
            </span>
          </div>

          <div>
            <p className="font-bold">Speed</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[0.75, 0.9, 1, 1.1].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => updateSettings({ rate: r })}
                  className={`py-2 rounded-xl text-sm font-extrabold border-[2.5px] border-outline ${settings.rate === r ? 'bg-sky text-white' : 'bg-surface text-ink/60'}`}
                >
                  {r === 0.75 ? 'Slow' : r === 0.9 ? 'Calm' : r === 1 ? 'Natural' : 'Fast'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => speak(SAMPLE)}
            className="btn-sky py-3"
          >
            <Volume2 size={18} /> Test voice
          </button>
        </div>
      </Section>

      <Section title={`Device voice${voices.length ? ` · ${voices.length} available` : ''}`}>
        {voices.length === 0 ? (
          <p className="p-4 text-sm text-ink/50">
            No Japanese voice found on this device. On iPhone: Settings → Accessibility → Spoken Content → Voices → Japanese, then download
            “O-ren” or “Kyoko (Enhanced)”. In Chrome or Edge, a natural Japanese voice is built in.
          </p>
        ) : (
          <>
            <p className="px-4 pt-3 text-xs text-ink/45">Used for anything without a recorded clip. Best-sounding voices are listed first.</p>
            <ul className="divide-y divide-line">
              {voices.map((v) => (
                <li key={v.voiceURI}>
                  <button
                    type="button"
                    onClick={() => {
                      updateSettings({ voiceURI: v.voiceURI })
                      setTimeout(() => speak(SAMPLE), 50)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="flex-1 text-[15px]">{v.name}</span>
                    {activeVoice === v && <Check size={18} className="text-indigo" />}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      <Section title="Look & goals">
        <div className="p-4 flex flex-col gap-4">
          <Choice label="Theme" value={settings.theme} options={[['system', 'Auto'], ['light', 'Light'], ['dark', 'Dark']]} onChange={(theme) => updateSettings({ theme })} />
          <Choice
            label="Daily XP goal"
            value={settings.dailyGoal}
            options={[[10, 'Chill'], [30, 'Steady'], [50, 'Serious'], [80, 'Intense']]}
            onChange={(dailyGoal) => updateSettings({ dailyGoal })}
          />
        </div>
      </Section>

      <Section title="Learning">
        <Toggle label="Furigana" hint="Small kana above kanji, so you can always read a word" value={settings.furigana} onChange={(v) => updateSettings({ furigana: v })} />
        <Toggle label="Romaji on new words" hint="Alphabet spelling on teaching cards. Turn off once kana feels easy" value={settings.romaji} onChange={(v) => updateSettings({ romaji: v })} />
        <Toggle label="Auto-play audio" hint="Hear every new word and every answer" value={settings.autoplay} onChange={(v) => updateSettings({ autoplay: v })} />
        <Toggle label="Sound effects" value={settings.sounds} onChange={(v) => updateSettings({ sounds: v })} />
        <Toggle
          label="Unlock all lessons"
          hint="Open every lesson to look around. Nothing is marked done, so turning it off brings the locks back"
          value={settings.unlockAll}
          onChange={(v) => updateSettings({ unlockAll: v })}
        />
      </Section>

      <Section title="Data">
        <button type="button" onClick={() => setConfirmReset(true)} className="w-full text-left px-4 py-3.5 text-danger font-bold">
          Reset all progress
        </button>
      </Section>
      <p className="text-xs text-ink/35 text-center mt-6">Progress is saved on this device only.</p>

      <ConfirmDialog
        open={confirmReset}
        danger
        title="Reset all progress?"
        message="This permanently deletes every completed lesson and your whole review history on this device. It can't be undone."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetAll()
          setConfirmReset(false)
        }}
      />
    </div>
  )
}

function Choice({ label, value, options, onChange }) {
  return (
    <div>
      <p className="font-extrabold">{label}</p>
      <div className={`mt-2 grid gap-2 ${options.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {options.map(([v, text]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`py-2 rounded-xl text-sm font-extrabold border-[2.5px] border-outline ${value === v ? 'bg-grape text-white' : 'bg-surface text-ink/60'}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-7">
      <h2 className="eyebrow text-ink/45 mb-2 px-1">{title}</h2>
      <div className="panel !rounded-2xl divide-y divide-line overflow-hidden">{children}</div>
    </section>
  )
}

function Toggle({ label, hint, value, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
      <div className="flex-1">
        <p className="font-bold">{label}</p>
        {hint && <p className="text-xs text-ink/45 mt-0.5">{hint}</p>}
      </div>
      <span className={`w-12 h-7 rounded-full p-0.5 border-[2.5px] border-outline transition-colors shrink-0 ${value ? 'bg-matcha' : 'bg-sunken'}`}>
        <span className={`block w-5 h-5 rounded-full bg-white border-2 border-outline transition-transform ${value ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  )
}
