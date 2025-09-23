import { useMemo, useState } from "react"
import "./index.css"

/** Utilitários simples de máscara/parse */
const brToNumber = (s: string) =>
  Number(String(s).replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")) || 0

const numberToBR = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 0 })

const moneyToBR = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })

export default function App() {
  // Entradas (simplificadas conforme combinado)
  const [rendaMensal, setRendaMensal] = useState("15.000")
  const [patrimonioAtual, setPatrimonioAtual] = useState("150.000")
  const [metaPatrimonio, setMetaPatrimonio] = useState("1.000.000") // opcional
  const [percentualInvest, setPercentualInvest] = useState("5") // % da renda
  const [idadeAtual, setIdadeAtual] = useState("37")
  const [idadeApos, setIdadeApos] = useState("65")
  const [retornoEsperadoAA, setRetornoEsperadoAA] = useState("10") // % a.a. nominal simplificado
  const [inflacaoAA, setInflacaoAA] = useState("5") // % a.a.
  const [gastoAlvoMes, setGastoAlvoMes] = useState("5.000")

  // Derivados
  const aporteMensal = useMemo(() => {
    const renda = brToNumber(rendaMensal)
    const perc = brToNumber(percentualInvest) / 100
    return Math.max(0, renda * perc)
  }, [rendaMensal, percentualInvest])

  const anosAteApos = useMemo(() => {
    const atual = brToNumber(idadeAtual)
    const alvo = brToNumber(idadeApos)
    return Math.max(0, alvo - atual)
  }, [idadeAtual, idadeApos])

  // Rentabilidade real (retorno - inflação), conforme seu pedido
  const rentRealAA = useMemo(() => {
    const r = brToNumber(retornoEsperadoAA) / 100
    const i = brToNumber(inflacaoAA) / 100
    return Math.max(-0.99, r - i) // trava mínima
  }, [retornoEsperadoAA, inflacaoAA])

  // Projeção do patrimônio final com juros compostos mês a mês (usando taxa real)
  const resultado = useMemo(() => {
    const P0 = brToNumber(patrimonioAtual)
    const PMT = aporteMensal
    const nMeses = anosAteApos * 12
    const iMes = Math.pow(1 + rentRealAA, 1 / 12) - 1

    const Pfinal =
      P0 * Math.pow(1 + iMes, nMeses) +
      (PMT > 0 && iMes !== 0 ? PMT * (Math.pow(1 + iMes, nMeses) - 1) / iMes : PMT * nMeses)

    return Math.max(0, Pfinal)
  }, [patrimonioAtual, aporteMensal, anosAteApos, rentRealAA])

  // Regra FIRE 4% a.a. → quanto pode gastar por mês (em R$ de hoje)
  const taxaRetiradaAnual = 0.04
  const podeGastarMes = useMemo(() => (resultado * taxaRetiradaAnual) / 12, [resultado])

  // Mensagens do “Resultado”
  const atingiuMeta = resultado >= brToNumber(metaPatrimonio || "0")
  const alerta = atingiuMeta
    ? "Parabéns! Você já atinge a meta de aposentadoria com os investimentos atuais."
    : "Você ainda não atinge a meta — ajuste aportes, idade-alvo ou retorno esperado."

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[hsl(var(--primary))]">
            Minhas Calculadoras
          </h1>
          <nav className="text-sm text-slate-600">
            <a className="hover:underline mr-4" href="https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias" target="_blank" rel="noreferrer">
              Previdência Social (oficial)
            </a>
            <span className="rounded bg-[hsl(var(--primary))] text-white px-2 py-1">v1.0 beta</span>
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h2 className="text-2xl font-semibold mb-4">Cálculo de Liberdade Financeira na Aposentadoria</h2>

          {/* Formulário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium">Quanto você ganha por mês?</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                <input className="w-full rounded-md border px-8 py-2"
                  value={rendaMensal}
                  onChange={(e) => setRendaMensal(e.target.value)} />
              </div>

              <label className="block text-sm font-medium">Quanto % da sua renda você investe?</label>
              <div className="relative">
                <input className="w-full rounded-md border pr-8 py-2"
                  value={percentualInvest}
                  onChange={(e) => setPercentualInvest(e.target.value)} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
              </div>

              <label className="block text-sm font-medium">Qual sua idade atual</label>
              <input className="w-full rounded-md border px-3 py-2"
                value={idadeAtual}
                onChange={(e) => setIdadeAtual(e.target.value)} />

              <label className="block text-sm font-medium">Com quantos anos você deseja se aposentar?</label>
              <input className="w-full rounded-md border px-3 py-2"
                value={idadeApos}
                onChange={(e) => setIdadeApos(e.target.value)} />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">Quanto você já tem investido?</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                <input className="w-full rounded-md border px-8 py-2"
                  value={patrimonioAtual}
                  onChange={(e) => setPatrimonioAtual(e.target.value)} />
              </div>

              <label className="block text-sm font-medium">Com quanto de patrimônio você quer se aposentar? (opcional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                <input className="w-full rounded-md border px-8 py-2"
                  value={metaPatrimonio}
                  onChange={(e) => setMetaPatrimonio(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Retorno esperado (a.a.)</label>
                  <div className="relative">
                    <input className="w-full rounded-md border pr-8 py-2"
                      value={retornoEsperadoAA}
                      onChange={(e) => setRetornoEsperadoAA(e.target.value)} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Inflação esperada (a.a.)</label>
                  <div className="relative">
                    <input className="w-full rounded-md border pr-8 py-2"
                      value={inflacaoAA}
                      onChange={(e) => setInflacaoAA(e.target.value)} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                </div>
              </div>

              <label className="block text-sm font-medium">Quanto você pretende gastar por mês aposentado?</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                <input className="w-full rounded-md border px-8 py-2"
                  value={gastoAlvoMes}
                  onChange={(e) => setGastoAlvoMes(e.target.value)} />
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            Os valores são em <strong>R$ de hoje</strong>. A rentabilidade <strong>real</strong> usada nos cálculos é
            <span className="font-semibold"> retorno esperado – inflação</span>. Regra FIRE (retirada): <strong>4.0% a.a.</strong>
          </p>

          {/* Controles +/- 1% */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">Ajustar rentabilidade real:</span>
            <button
              className="rounded-md bg-[hsl(var(--primary))] text-white px-3 py-1 hover:opacity-90"
              onClick={() => setRetornoEsperadoAA(String(brToNumber(retornoEsperadoAA) - 1))}
            >
              −1%
            </button>
            <button
              className="rounded-md bg-[hsl(var(--primary))]/80 text-white px-3 py-1 hover:opacity-90"
              onClick={() => setRetornoEsperadoAA(String(brToNumber(retornoEsperadoAA) + 1))}
            >
              +1%
            </button>
          </div>

          {/* Resultado */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Resultado</h3>

            <div className={`rounded-md border px-4 py-3 mb-4 ${atingiuMeta ? "bg-green-50 border-green-200 text-green-800" : "bg-yellow-50 border-yellow-200 text-yellow-800"}`}>
              {alerta}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h4 className="text-slate-600 text-sm">Aporte estimado por mês</h4>
                <p className="text-2xl font-semibold">{moneyToBR(aporteMensal)}</p>
                <p className="text-xs text-slate-500">(R$ {numberToBR(brToNumber(rendaMensal))} × {brToNumber(percentualInvest)}%)</p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="text-slate-600 text-sm">Você se aposentará com</h4>
                <p className="text-2xl font-semibold">{moneyToBR(resultado)}</p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="text-slate-600 text-sm">Poderá gastar por mês (regra 4%)</h4>
                <p className="text-2xl font-semibold">{moneyToBR(podeGastarMes)}</p>
              </div>
            </div>
          </section>

          {/* Nota FIRE simples */}
          <section className="mt-8 text-sm text-slate-600 leading-relaxed">
            <h4 className="font-semibold text-slate-700 mb-2">O que é FIRE?</h4>
            <p>
              <strong>FIRE</strong> (Financial Independence, Retire Early) é uma regra prática para planejar a
              independência financeira: você acumula um patrimônio e, ao se aposentar, retira cerca de
              <strong> 4% ao ano</strong> desse patrimônio (em média). Isso dá uma noção de quanto você
              pode gastar por mês sem, em teoria, esgotar o dinheiro no longo prazo (considerando retornos reais).
            </p>
          </section>
        </div>
      </main>

      {/* Rodapé (estático, sem sobreposição) */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-slate-600 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>© Minhas Calculadoras — <span className="text-slate-500">Versão 1.0 beta</span></div>
          <div className="space-x-4">
            <a className="link-muted" href="/politica-privacidade.html">Política de Privacidade</a>
            <a className="link-muted" href="/termos-de-uso.html">Termos de Uso</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
