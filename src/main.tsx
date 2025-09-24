import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import LiberdadeFinanceira from './pages/LiberdadeFinanceira'
import AposentadoriaOficial from './pages/AposentadoriaOficial'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/liberdade-financeira" element={<LiberdadeFinanceira />} />
          <Route path="/aposentadoria-oficial" element={<AposentadoriaOficial />} />
          {/* Outras calculadoras futuramente */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
      {/* Rodapé centralizado e consistente */}
      <footer className="w-full flex justify-center items-center border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 mt-10">
        <div className="mx-auto px-4 py-4 text-xs text-neutral-500 text-center" style={{ maxWidth: 1100, lineHeight: 1.6 }}>
          © Minhas Calculadoras — v1.0 beta ·{' '}
          <a href="/politica-privacidade.html" className="underline text-blue-700">Política de Privacidade</a>{' '}
          ·{' '}
          <a href="/termos-de-uso.html" className="underline text-blue-700">Termos de Uso</a>
        </div>
      </footer>
    </BrowserRouter>
  </React.StrictMode>,
)
