import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="page-shell">
      <main className="page-main">
        <App />
      </main>
      <footer className="footer">
        <div className="mx-auto max-w-5xl px-4 py-3 text-xs text-muted-foreground">
          © Minhas Calculadoras — v1.0.1 beta ·
          <span className="ml-2">
            Para simulações oficiais de aposentadoria, recomendo acessar o
            <a className="underline ml-1" href="https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias" target="_blank" rel="noreferrer">site da Previdência</a>.
          </span>
          <span className="ml-3">
            <a className="underline" href="/politica-privacidade.html">Política de Privacidade</a>
            <span> · </span>
            <a className="underline" href="/termos-de-uso.html">Termos de Uso</a>
          </span>
        </div>
      </footer>
    </div>
  </React.StrictMode>,
)
