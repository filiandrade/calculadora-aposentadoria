import { Link } from "react-router-dom"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="w-full px-4 py-4 bg-white shadow-sm mb-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/" className="text-xl font-light tracking-tight text-neutral-900">Minhas Calculadoras</Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
