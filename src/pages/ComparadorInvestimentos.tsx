import { useState } from "react"
import { InputAffix } from "../components/InputAffix"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function ComparadorInvestimentos() {
  const [valorInicial, setValorInicial] = useState(10000)
  const [aporteMensal, setAporteMensal] = useState(1000)
  const [prazo, setPrazo] = useState(10)
  const [taxaA, setTaxaA] = useState(8)
  const [taxaB, setTaxaB] = useState(12)
  const [grafico, setGrafico] = useState<{ mes: number, saldoA: number, saldoB: number }[]>([])
  const [resultado, setResultado] = useState<null | { finalA: number, finalB: number }>(null)

  function calcular() {
    let saldoA = valorInicial
    let saldoB = valorInicial
    const iA = taxaA / 100 / 12
    const iB = taxaB / 100 / 12
    const meses = prazo * 12
    const data = []
    for (let m = 1; m <= meses; m++) {
      saldoA = saldoA * (1 + iA) + aporteMensal
      saldoB = saldoB * (1 + iB) + aporteMensal
      data.push({ mes: m, saldoA, saldoB })
    }
    setGrafico(data)
    setResultado({ finalA: saldoA, finalB: saldoB })
  }

  function limpar() {
    setValorInicial(10000)
    setAporteMensal(1000)
    setPrazo(10)
    setTaxaA(8)
    setTaxaB(12)
    setGrafico([])
    setResultado(null)
  }

  function imprimir() {
    window.print()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900 flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
          <rect x="4" y="14" width="8" height="8" rx="2" fill="#2563eb" />
          <rect x="16" y="8" width="8" height="14" rx="2" fill="#10b981" />
        </svg>
        Comparador de Investimentos
      </h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Valor inicial</label>
              <InputAffix type="number" prefix="R$" min={0} value={valorInicial} onChange={e => setValorInicial(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Aporte mensal</label>
              <InputAffix type="number" prefix="R$" min={0} value={aporteMensal} onChange={e => setAporteMensal(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prazo</label>
              <InputAffix type="number" suffix="anos" min={1} max={50} value={prazo} onChange={e => setPrazo(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Taxa anual investimento A</label>
              <InputAffix type="number" suffix="%" min={0} step={0.01} value={taxaA} onChange={e => setTaxaA(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Taxa anual investimento B</label>
              <InputAffix type="number" suffix="%" min={0} step={0.01} value={taxaB} onChange={e => setTaxaB(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="rounded-full bg-neutral-100 px-5 py-2 text-neutral-700 font-medium border border-neutral-200 shadow-sm hover:bg-neutral-200 transition" onClick={limpar}>
              Limpar
            </button>
            <button type="button" className="rounded-full bg-black/90 px-5 py-2 text-white font-medium shadow-sm hover:bg-black transition" onClick={imprimir}>
              Imprimir
            </button>
            <button type="submit" className="rounded-full bg-blue-600 px-5 py-2 text-white font-medium shadow-sm hover:bg-blue-700 transition">
              Calcular
            </button>
          </div>
        </form>
        {resultado && (
          <div className="mt-6 bg-neutral-50 rounded-xl p-4 border text-base grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-neutral-500 mb-1">Saldo final investimento A</span>
              <span className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xl font-bold tracking-tight">
                R$ {resultado.finalA.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-neutral-500 mb-1">Saldo final investimento B</span>
              <span className="bg-green-600 text-white rounded-lg px-4 py-2 text-xl font-bold tracking-tight">
                R$ {resultado.finalB.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
        <div className="mt-8">
          <h3 className="font-semibold mb-2 text-neutral-800 text-sm">Gráfico comparativo:</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={grafico} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tickFormatter={m => `${m}`} label={{ value: "", position: "insideBottomRight", offset: -4 }} />
              <YAxis tickFormatter={v => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Tooltip formatter={(val: number, name: string) => [`R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, name === 'saldoA' ? 'Investimento A' : 'Investimento B']} labelFormatter={l => `Mês: ${l}`} />
              <Legend verticalAlign="top" height={36} formatter={v => v === 'saldoA' ? 'Investimento A' : 'Investimento B'} />
              <Line type="monotone" dataKey="saldoA" stroke="#2563eb" strokeWidth={2.5} dot={true} name="Investimento A" />
              <Line type="monotone" dataKey="saldoB" stroke="#10b981" strokeWidth={2.5} dot={true} name="Investimento B" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-neutral-500">* Gráfico ilustrativo. Valores aproximados, sem impostos ou taxas.</div>
        </div>
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
      {/* Seção explicativa adicional */}
      <section className="mt-12 print:break-before-page text-[15px]">
        <h3 className="font-semibold mb-2 text-base text-neutral-900">Como funciona este comparador?</h3>
        <p className="text-xs text-neutral-500 mb-2">
          Este comparador simula o crescimento de dois investimentos diferentes ao longo do tempo, considerando:
        </p>
        <ul className="list-disc pl-6 text-neutral-500 text-xs mb-2">
          <li>Valor inicial investido.</li>
          <li>Aportes mensais recorrentes.</li>
          <li>Taxa de juros anual de cada investimento.</li>
          <li>Prazo total em anos.</li>
        </ul>
        <p className="text-xs text-neutral-500">
          Os resultados mostram o saldo final de cada investimento e o gráfico comparativo mês a mês. Ideal para visualizar o impacto das taxas e aportes em diferentes cenários.
        </p>
      </section>
    </div>
  )
}
