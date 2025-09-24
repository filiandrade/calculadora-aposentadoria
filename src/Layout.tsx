import { Link, useLocation } from "react-router-dom"

function HomeButton() {
  const location = useLocation();
  if (location.pathname === "/") return null;
  return (
    <Link to="/" className="inline-flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 p-2 transition" title="Início">
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 11.5L12 4l9 7.5" stroke="#222" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10.5V20a1 1 0 001 1h3.5a1 1 0 001-1v-4.5h2V20a1 1 0 001 1H18a1 1 0 001-1v-9.5" stroke="#222" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </Link>
  );
}

function ShareButtons() {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = encodeURIComponent('Veja esta calculadora útil!');
  return (
    <div className="flex gap-2 ml-2">
      <a href={`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" title="Compartilhar no WhatsApp" className="inline-flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 border border-green-200 p-2 transition">
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.828-2.236A11.94 11.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3z" stroke="#25D366" strokeWidth="2"/><path d="M22.2 19.2c-.3-.15-1.775-.875-2.05-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.275-.47-2.43-1.5-.9-.8-1.5-1.775-1.675-2.075-.175-.3-.018-.462.132-.612.136-.136.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.25-.6-.5-.5-.675-.5-.175 0-.375-.025-.575-.025-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.125 3.25 5.15 4.425.72.288 1.28.46 1.72.588.722.206 1.38.177 1.9.108.58-.077 1.775-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" fill="#25D366"/></svg>
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" title="Compartilhar no Facebook" className="inline-flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-200 p-2 transition">
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><path d="M29 16c0-7.18-5.82-13-13-13S3 8.82 3 16c0 6.48 4.84 11.82 11 12.82V20.5h-3v-3h3v-2.3c0-3 1.79-4.7 4.52-4.7 1.31 0 2.68.24 2.68.24v3h-1.51c-1.49 0-1.95.93-1.95 1.89V17.5h3.32l-.53 3H19.7v8.32C25.16 27.82 29 22.48 29 16z" fill="#1877F3"/><path d="M19.7 28.82V20.5h2.79l.53-3H19.7v-1.21c0-.96.46-1.89 1.95-1.89h1.51v-3s-1.37-.24-2.68-.24c-2.73 0-4.52 1.7-4.52 4.7v2.3h-3v3h3v8.32A13.01 13.01 0 0 0 16 29c.63 0 1.25-.04 1.86-.12z" fill="#fff"/></svg>
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`} target="_blank" rel="noopener noreferrer" title="Compartilhar no X/Twitter" className="inline-flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 p-2 transition">
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><path d="M29 7.14a10.14 10.14 0 0 1-2.89.79A5.07 5.07 0 0 0 28.22 5.2a10.14 10.14 0 0 1-3.22 1.23A5.07 5.07 0 0 0 16 10.07c0 .4.04.8.12 1.18A14.39 14.39 0 0 1 4.1 5.6a5.07 5.07 0 0 0 1.57 6.77A5.07 5.07 0 0 1 3.2 11v.06a5.07 5.07 0 0 0 4.07 4.97 5.07 5.07 0 0 1-2.29.09 5.07 5.07 0 0 0 4.74 3.52A10.16 10.16 0 0 1 3 25.07a14.32 14.32 0 0 0 7.77 2.28c9.33 0 14.44-7.73 14.44-14.44 0-.22 0-.43-.02-.65A10.3 10.3 0 0 0 29 7.14z" fill="#222"/></svg>
      </a>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-[15px]">
      <header className="w-full px-4 py-4 bg-white shadow-sm mb-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3 select-none" style={{textDecoration: 'none'}}>
              <span className="rounded-full bg-black text-white px-4 py-2 text-2xl font-bold tracking-tight shadow-lg border border-neutral-200" style={{letterSpacing: '-0.04em', boxShadow: '0 2px 12px 0 #0001'}}>MC</span>
              <span className="text-2xl font-light tracking-tight text-neutral-900" style={{letterSpacing: '-0.04em', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', fontWeight: 300}}>Minhas Calculadoras</span>
            </Link>
            <ShareButtons />
          </div>
          <div className="flex items-center gap-2">
            <HomeButton />
          </div>
          <span className="hidden md:block text-xs text-neutral-400 font-mono tracking-wide" style={{letterSpacing: '0.08em'}}>Simule, compare e planeje seu futuro financeiro.</span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
