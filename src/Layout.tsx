import { Link } from "react-router-dom"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="w-full px-4 py-4 bg-white shadow-sm mb-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 select-none" style={{textDecoration: 'none'}}>
            <span className="rounded-full bg-black text-white px-3 py-1.5 text-lg font-bold tracking-tight" style={{letterSpacing: '-0.04em'}}>MC</span>
            <span className="text-xl font-light tracking-tight text-neutral-900" style={{letterSpacing: '-0.04em'}}>Minhas Calculadoras</span>
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
