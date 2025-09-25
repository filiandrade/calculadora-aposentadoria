import { useState } from "react"
import { InputAffix } from "../components/InputAffix"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function JurosCompostos() {

  const [valorInicial, setValorInicial] = useState(1000)
  const [aporteMensal, setAporteMensal] = useState(1000)
  const [taxa, setTaxa] = useState(10)
  const [anos, setAnos] = useState(20)
  const [resultado, setResultado] = useState<null | { total: number, investido: number, juros: number }>(null)
  const [grafico, setGrafico] = useState<{ mes: number, saldo: number, investido: number, juros: number }[]>([])

  function calcular() {
    const meses = anos * 12
    const i = taxa / 100 / 12
    let saldo = valorInicial
    let investido = valorInicial
    const data = [{ mes: 0, saldo, investido, juros: 0 }]
    for (let m = 1; m <= meses; m++) {
      saldo = saldo * (1 + i) + aporteMensal
      investido += aporteMensal
      data.push({ mes: m, saldo, investido, juros: saldo - investido })
    }
    const juros = saldo - investido
    setResultado({ total: saldo, investido, juros })
    setGrafico(data)
  }

  function limpar() {
    setValorInicial(1000)
    setAporteMensal(1000)
    setTaxa(10)
    setAnos(20)
    setResultado(null)
    setGrafico([])
  }

  function imprimir() {
    window.print()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900 flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
          <circle cx="14" cy="14" r="13" stroke="#2563eb" strokeWidth="2" fill="#f6f7f9" />
          <path d="M8 18L12 12L16 16L20 10" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Juros Compostos
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
              <label className="block text-sm font-medium mb-1">Taxa de juros anual</label>
              <InputAffix type="number" suffix="%" min={0} step={0.01} value={taxa} onChange={e => setTaxa(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prazo</label>
              <InputAffix type="number" suffix="anos" min={1} max={50} value={anos} onChange={e => setAnos(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="rounded-full bg-neutral-100 px-5 py-2 text-neutral-700 font-medium border border-neutral-200 shadow-sm hover:bg-neutral-200 transition" onClick={limpar}>
              Limpar
            </button>
            <button type="button" className="rounded-full bg-black/90 px-5 py-2 text-white font-medium shadow-sm hover:bg-black transition" onClick={imprimir}>
              Imprimir
            </button>
              <button type="submit" className="rounded-full bg-black/90 px-5 py-2 text-white font-medium shadow-sm hover:bg-black transition">
              Calcular
            </button>
          </div>
        </form>
        {resultado && (
          <>
            <div className="mt-6 bg-neutral-50 rounded-xl p-4 border text-base grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-semibold text-neutral-500 mb-1">Total acumulado</span>
                <span className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xl font-bold tracking-tight" style={{letterSpacing: '-0.04em'}}>
                  R$ {resultado.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-semibold text-neutral-500 mb-1">Total investido</span>
                <span className="bg-white text-blue-600 border border-blue-600 rounded-lg px-4 py-2 text-xl font-bold tracking-tight">
                  R$ {resultado.investido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-semibold text-neutral-500 mb-1">Juros ganhos</span>
                <span className="bg-white text-green-600 border border-green-600 rounded-lg px-4 py-2 text-xl font-bold tracking-tight">
                  R$ {resultado.juros.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-semibold mb-2 text-neutral-800 text-sm">Evolução mês a mês</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={grafico} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" tickFormatter={m => `${m}`} label={{ value: "Meses", position: "insideBottomRight", offset: -4 }} />
                  <YAxis tickFormatter={v => `R$ ${Math.round(v/1000)}k`} />
                  <Tooltip formatter={(val: number, name: string) => [`R$ ${val.toLocaleString('pt-BR')}`, name === 'saldo' ? 'Saldo acumulado' : name === 'investido' ? 'Total investido' : 'Juros ganhos']} labelFormatter={l => `Mês: ${l}`} />
                  <Legend verticalAlign="top" height={36} formatter={v => v === 'saldo' ? 'Saldo acumulado' : v === 'investido' ? 'Total investido' : 'Juros ganhos'} />
                  <Line type="monotone" dataKey="saldo" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Saldo acumulado" />
                  <Line type="monotone" dataKey="investido" stroke="#a3a3a3" strokeWidth={2.5} dot={false} name="Total investido" />
                  <Line type="monotone" dataKey="juros" stroke="#10b981" strokeWidth={2.5} dot={false} name="Juros ganhos" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-neutral-500">* Gráfico ilustrativo. Valores aproximados, sem impostos ou taxas.</div>
            </div>
          </>
        )}
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro.<br/>
        Versão BETA — sujeita a ajustes.
      </div>

      {/* Seção explicativa adicional */}
      <section className="mt-12 print:break-before-page text-[15px]">
        <h3 className="font-semibold mb-2 text-base text-neutral-900">Como funciona esta calculadora?</h3>
        <p className="text-xs text-neutral-500 mb-2">
          Esta calculadora de <strong>Juros Compostos</strong> simula o crescimento de um investimento ao longo do tempo, considerando:
        </p>
        <ul className="list-disc pl-6 text-neutral-500 text-xs mb-2">
          <li>Valor inicial investido.</li>
          <li>Aportes mensais recorrentes.</li>
          <li>Taxa de juros anual composta.</li>
          <li>Prazo total em anos.</li>
        </ul>
        <p className="text-xs text-neutral-500">
          Os resultados mostram o total acumulado, o valor investido e os juros ganhos. Ideal para visualizar o poder dos juros compostos em investimentos de longo prazo.
        </p>
      </section>
    </div>
  )
}