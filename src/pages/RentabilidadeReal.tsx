import { useState } from "react"
import { InputAffix } from "../components/InputAffix"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function RentabilidadeReal() {
  const [rendimento, setRendimento] = useState(8)
  const [inflacao, setInflacao] = useState(4)
  const [anos, setAnos] = useState(10)
  const [resultado, setResultado] = useState<null | { real: number }>(null)
  const [grafico, setGrafico] = useState<{ ano: number, bruto: number, real: number }[]>([])

  function calcular() {
    const data = []
    let bruto = 100
    let real = 100
    for (let a = 1; a <= anos; a++) {
      bruto = bruto * (1 + rendimento / 100)
      real = real * ((1 + rendimento / 100) / (1 + inflacao / 100))
      data.push({ ano: a, bruto, real })
    }
    const realPercent = ((1 + rendimento / 100) / (1 + inflacao / 100) - 1) * 100
    setResultado({ real: realPercent })
    setGrafico(data)
  }

  function limpar() {
    setRendimento(8)
    setInflacao(4)
    setAnos(10)
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
          <circle cx="14" cy="14" r="13" stroke="#10b981" strokeWidth="2" fill="#f6f7f9" />
          <path d="M8 18L14 10L20 18" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Rentabilidade Real
      </h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rendimento bruto</label>
              <InputAffix type="number" suffix="%" min={-100} step={0.01} value={rendimento} onChange={e => setRendimento(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Inflação</label>
              <InputAffix type="number" suffix="%" min={-100} step={0.01} value={inflacao} onChange={e => setInflacao(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prazo</label>
              <InputAffix type="number" suffix="anos" min={1} max={50} value={anos} onChange={e => setAnos(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="rounded-full bg-neutral-100 px-5 py-2 text-neutral-700 font-medium border border-neutral-200 shadow-sm hover:bg-neutral-200 transition" onClick={limpar}>Limpar</button>
            <button type="button" className="rounded-full bg-black/90 px-5 py-2 text-white font-medium shadow-sm hover:bg-black transition" onClick={imprimir}>Imprimir</button>
            <button type="submit" className="rounded-full bg-blue-600 px-5 py-2 text-white font-medium shadow-sm hover:bg-blue-700 transition">Calcular</button>
          </div>
        </form>
        {resultado && (
          <>
            <div className="mt-6 bg-neutral-50 rounded-xl p-4 border text-base">
              <div><strong>Rentabilidade real anual:</strong> {resultado.real.toFixed(2)}%</div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-neutral-800 text-sm">Evolução do investimento (R$100 iniciais)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={grafico} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ano" label={{ value: "Ano", position: "insideBottomRight", offset: -4 }} />
                  <YAxis tickFormatter={v => `R$ ${Math.round(v)}`} />
                  <Tooltip formatter={(val: number, name: string) => [`R$ ${val.toLocaleString('pt-BR')}`, name === 'bruto' ? 'Bruto' : 'Real']} labelFormatter={l => `Ano: ${l}`} />
                  <Legend verticalAlign="top" height={36} formatter={v => v === 'bruto' ? 'Bruto' : 'Real (descontada inflação)'} />
                  <Line type="monotone" dataKey="bruto" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Bruto" />
                  <Line type="monotone" dataKey="real" stroke="#10b981" strokeWidth={2.5} dot={false} name="Real" />
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
          Esta calculadora de <strong>Rentabilidade Real</strong> mostra o rendimento de um investimento descontando a inflação, considerando:
        </p>
        <ul className="list-disc pl-6 text-neutral-500 text-xs mb-2">
          <li>Rendimento bruto anual informado.</li>
          <li>Inflação anual estimada.</li>
          <li>Prazo total em anos.</li>
        </ul>
        <p className="text-xs text-neutral-500">
          O gráfico mostra a evolução do valor investido ao longo do tempo, tanto em valores brutos quanto reais (descontada a inflação). Ideal para comparar investimentos em diferentes cenários econômicos.
        </p>
      </section>
    </div>
  )
}