'use client'
import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })

        if (res.ok) {
          const from = searchParams.get('from') || '/dashboard'
          router.push(from)
          router.refresh()
        } else {
          setError('Invalid username or password')
        }
      } catch {
        setError('Something went wrong. Try again.')
      }
    })
  }

  return (
    <div className="min-h-screen flex">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:flex w-[420px] flex-shrink-0 bg-[#0A0A0A] flex-col justify-between p-10"
      >
        <div>
          <p className="text-[11px] text-[#3A3A3A] uppercase tracking-[0.15em] font-medium mb-12">Mojtaba OS</p>
          <h1 className="text-3xl font-semibold text-cream-200 leading-tight">Your personal<br />operating system.</h1>
          <p className="text-[13px] text-[#5A5550] mt-4 leading-relaxed">
            Manage migration, IELTS, Balinex,<br />
            Academy, Content — all in one place.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { label: 'P1', name: 'Migration', color: '#EF4444' },
            { label: 'P2', name: 'IELTS', color: '#F97316' },
            { label: 'P3', name: 'Balinex', color: '#3B82F6' },
            { label: 'P4', name: 'Academy', color: '#22C55E' },
            { label: 'P5', name: 'Content', color: '#A855F7' },
          ].map(p => (
            <div key={p.label} className="flex items-center gap-3">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: p.color + '25', color: p.color }}>{p.label}</span>
              <span className="text-[12px] text-[#5A5550]">{p.name}</span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-[#2A2A2A]">© 2026 Mojtaba Yazdanpanah</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 bg-cream-200 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-[340px]">
          <p className="text-[11px] text-[#A09388] uppercase tracking-[0.15em] font-medium mb-8 lg:hidden">Mojtaba OS</p>
          <h2 className="text-2xl font-semibold text-ink-200 mb-1">Welcome back</h2>
          <p className="text-[13px] text-[#A09388] mb-8">Sign in to your workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Your username"
                autoComplete="username"
                autoFocus
                className="w-full text-[13px] bg-white border border-[#E4DDD3] rounded-xl px-4 py-3 focus:outline-none focus:border-ink-200 focus:ring-2 focus:ring-ink-200/10 transition-all text-ink-200 placeholder:text-[#C4B9AD]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="w-full text-[13px] bg-white border border-[#E4DDD3] rounded-xl px-4 py-3 pr-11 focus:outline-none focus:border-ink-200 focus:ring-2 focus:ring-ink-200/10 transition-all text-ink-200 placeholder:text-[#C4B9AD]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4B9AD] hover:text-[#6B6259] transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[12px] text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isPending || !username || !password}
              className="w-full flex items-center justify-center gap-2 py-3 bg-ink-200 text-cream-200 rounded-xl text-[13px] font-medium hover:bg-ink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-cream-400 border-t-cream-200 rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={14} />
                  Sign in
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-[#C4B9AD] text-center mt-8">
            Private workspace · Not for public access
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
