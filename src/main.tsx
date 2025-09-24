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
      <footer className="footer">
        <div className="mx-auto max-w-5xl px-4 py-3 text-xs text-muted-foreground">
          © Minhas Calculadoras — v1.0 beta ·
          <span className="ml-3">
            <a className="underline" href="/politica-privacidade.html">Política de Privacidade</a>
            <span> · </span>
            <a className="underline" href="/termos-de-uso.html">Termos de Uso</a>
          </span>
        </div>
      </footer>
    </BrowserRouter>
  </React.StrictMode>,
)
