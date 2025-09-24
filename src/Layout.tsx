import { Link } from "react-router-dom"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="w-full px-4 py-4 bg-white shadow-sm mb-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 select-none" style={{textDecoration: 'none'}}>
            <span className="rounded-full bg-black text-white px-4 py-2 text-2xl font-bold tracking-tight shadow-lg border border-neutral-200" style={{letterSpacing: '-0.04em', boxShadow: '0 2px 12px 0 #0001'}}>MC</span>
            <span className="text-2xl font-light tracking-tight text-neutral-900" style={{letterSpacing: '-0.04em', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', fontWeight: 300}}>Minhas Calculadoras</span>
          </Link>
          <span className="hidden md:block text-xs text-neutral-400 font-mono tracking-wide" style={{letterSpacing: '0.08em'}}>inspirado por Apple, Osklen &amp; Palantir</span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
