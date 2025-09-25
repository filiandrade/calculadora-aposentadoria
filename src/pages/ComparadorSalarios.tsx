import { useState } from "react"
import { InputAffix } from "../components/InputAffix"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function ComparadorSalarios() {
  const [salarioA, setSalarioA] = useState(4000)
  const [beneficiosA, setBeneficiosA] = useState(800)
  const [salarioB, setSalarioB] = useState(5000)
  const [beneficiosB, setBeneficiosB] = useState(500)
  const [descontosA, setDescontosA] = useState(1200)
  const [descontosB, setDescontosB] = useState(1500)
  const [resultado, setResultado] = useState<null | { liquidoA: number, liquidoB: number }>(null)

  function calcular() {
    const liquidoA = salarioA + beneficiosA - descontosA
    const liquidoB = salarioB + beneficiosB - descontosB
    setResultado({ liquidoA, liquidoB })
  }

  function limpar() {
    setSalarioA(4000)
    setBeneficiosA(800)
    setSalarioB(5000)
    setBeneficiosB(500)
    setDescontosA(1200)
    setDescontosB(1500)
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
        Comparador de Salários
      </h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Salário A</label>
              <InputAffix type="number" prefix="R$" min={0} value={salarioA} onChange={e => setSalarioA(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Benefícios A</label>
              <InputAffix type="number" prefix="R$" min={0} value={beneficiosA} onChange={e => setBeneficiosA(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descontos A</label>
              <InputAffix type="number" prefix="R$" min={0} value={descontosA} onChange={e => setDescontosA(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Salário B</label>
              <InputAffix type="number" prefix="R$" min={0} value={salarioB} onChange={e => setSalarioB(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Benefícios B</label>
              <InputAffix type="number" prefix="R$" min={0} value={beneficiosB} onChange={e => setBeneficiosB(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descontos B</label>
              <InputAffix type="number" prefix="R$" min={0} value={descontosB} onChange={e => setDescontosB(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
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
              <span className="text-xs font-semibold text-neutral-500 mb-1">Salário líquido A</span>
              <span className="bg-blue-600 text-white rounded-lg px-4 py-2 text-xl font-bold tracking-tight">
                R$ {resultado.liquidoA.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-neutral-500 mb-1">Salário líquido B</span>
              <span className="bg-green-600 text-white rounded-lg px-4 py-2 text-xl font-bold tracking-tight">
                R$ {resultado.liquidoB.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
        <div className="mt-8">
          <h3 className="font-semibold mb-2 text-neutral-800 text-sm">Gráfico comparativo:</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resultado ? [{ tipo: 'A', valor: resultado.liquidoA }, { tipo: 'B', valor: resultado.liquidoB }] : []} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis tickFormatter={v => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Tooltip formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="valor" fill="#2563eb" name="Salário Líquido" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-neutral-500">* Gráfico ilustrativo. Valores aproximados, sem impostos ou taxas.</div>
        </div>
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro ou trabalhista.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
      {/* Seção explicativa adicional */}
      <section className="mt-12 print:break-before-page text-[15px]">
        <h3 className="font-semibold mb-2 text-base text-neutral-900">Como funciona este comparador?</h3>
        <p className="text-xs text-neutral-500 mb-2">
          Este comparador permite analisar salários líquidos de dois cenários diferentes, considerando:
        </p>
        <ul className="list-disc pl-6 text-neutral-500 text-xs mb-2">
          <li>Salário bruto e benefícios de cada cenário.</li>
          <li>Descontos (impostos, previdência, etc) de cada cenário.</li>
        </ul>
        <p className="text-xs text-neutral-500">
          Os resultados mostram o salário líquido de cada cenário e o gráfico comparativo. Ideal para comparar propostas de emprego ou regimes de contratação.
        </p>
      </section>
    </div>
  )
}
