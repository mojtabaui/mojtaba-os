'use client'
import { useState, useTransition, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'


function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'user' | 'pass'>('user')
  const [shaking, setShaking] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [clock, setClock] = useState('')
  const [dateLabel, setDateLabel] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      setClock(`${h}:${m}`)
      setDateLabel(now.toLocaleDateString('fa-IR', { weekday: 'long', month: 'long', day: 'numeric' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })
        if (res.ok) {
          router.push(searchParams.get('from') || '/dashboard')
          router.refresh()
        } else {
          setShaking(true)
          setPassword('')
          setTimeout(() => setShaking(false), 600)
        }
      } catch {
        setShaking(true)
        setTimeout(() => setShaking(false), 600)
      }
    })
  }

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col">
      {/* Wallpaper */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'url(/wallpaper/wallpaper.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />

      {/* Time — top center */}
      <div className="relative z-10 text-center pt-16 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-white/40 text-sm font-light tracking-[0.2em] uppercase"
        >
          {dateLabel}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="text-white font-thin leading-none mt-2"
          style={{ fontSize: 'clamp(5rem, 14vw, 9rem)', letterSpacing: '-0.02em' }}
        >
          {clock}
        </motion.p>
      </div>

      {/* Login card — center */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', damping: 18, stiffness: 150 }}
          className="flex flex-col items-center gap-5"
        >
          {/* Profile photo */}
          <div
            className="w-[104px] h-[104px] rounded-full overflow-hidden"
            style={{
              boxShadow: '0 0 0 3px rgba(255,255,255,0.15), 0 0 50px rgba(139,92,246,0.5), 0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            <img
              src="/profile/profile.png"
              alt="مجتبا"
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.target as HTMLImageElement
                t.style.display = 'none'
                if (t.parentElement) {
                  t.parentElement.style.background = 'linear-gradient(145deg,#7c3aed,#2563eb)'
                  t.parentElement.innerHTML = '<span style="color:white;font-size:2.5rem;display:flex;align-items:center;justify-content:center;height:100%">م</span>'
                }
              }}
            />
          </div>

          {/* Name */}
          <div className="text-center">
            <h2 className="text-white text-xl font-semibold" style={{ letterSpacing: '0.02em' }}>مجتبا</h2>
            <p className="text-white/35 text-xs mt-1 tracking-widest">SENIOR UI/UX DESIGNER</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-3 w-64">
            {step === 'user' ? (
              <motion.div key="user-step" className="w-full flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && username) setStep('pass') }}
                  placeholder="نام کاربری"
                  autoFocus
                  className="w-full text-center text-[14px] text-white rounded-2xl px-4 py-3 focus:outline-none placeholder:text-white/25 transition-all"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)' }}
                />
                <button
                  type="button"
                  onClick={() => username && setStep('pass')}
                  className="w-full py-2.5 text-white text-[13px] font-medium rounded-2xl transition-all hover:brightness-110"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(16px)' }}
                >
                  ادامه →
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="pass-step"
                className="w-full flex flex-col gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: shaking ? [0, -10, 10, -8, 8, -4, 4, 0] : 0 }}
                transition={{ duration: shaking ? 0.5 : 0.2 }}
              >
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="رمز عبور"
                  autoFocus
                  className="w-full text-center text-[14px] text-white rounded-2xl px-4 py-3 focus:outline-none placeholder:text-white/25 transition-all"
                  style={{
                    background: shaking ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${shaking ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.18)'}`,
                    backdropFilter: 'blur(16px)',
                  }}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('user')}
                    className="flex-1 py-2.5 text-white/50 text-[12px] rounded-2xl transition-all hover:text-white/70"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    بازگشت
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !password}
                    className="flex-1 py-2.5 text-white text-[13px] font-semibold rounded-2xl transition-all hover:brightness-110 disabled:opacity-40 flex items-center justify-center"
                    style={{ background: 'rgba(139,92,246,0.6)', border: '1px solid rgba(139,92,246,0.5)', backdropFilter: 'blur(16px)' }}
                  >
                    {isPending
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : 'ورود'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>

      {/* Bottom hint */}
      <p className="relative z-10 text-center text-white/15 text-[10px] tracking-[0.3em] pb-8">
        MOJTABA OS · PERSONAL WORKSPACE
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
