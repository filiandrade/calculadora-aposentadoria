import { useState } from "react"
import { InputAffix } from "../components/InputAffix"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function Inss() {
  const [renda, setRenda] = useState(3000)
  const [categoria, setCategoria] = useState("CLT")
  const [anos, setAnos] = useState(10)
  const [resultado, setResultado] = useState<null | { contribuicao: number }>(null)
  const [grafico, setGrafico] = useState<{ ano: number, total: number }[]>([])

  function calcular() {
    let contribuicao = 0
    if (categoria === "CLT") {
      contribuicao = renda * 0.11
      if (contribuicao > 908.85) contribuicao = 908.85 // teto 2025
    } else if (categoria === "MEI") {
      contribuicao = 70 // valor fixo aproximado
    } else {
      contribuicao = renda * 0.20
    }
    setResultado({ contribuicao })
    // Gráfico: evolução do total contribuído ao longo dos anos
    const data = []
    let total = 0
    for (let a = 1; a <= anos; a++) {
      total += contribuicao * 12
      data.push({ ano: a, total })
    }
    setGrafico(data)
  }

  function limpar() {
    setRenda(3000)
    setCategoria("CLT")
    setAnos(10)
    setResultado(null)
    setGrafico([])
  }

  function imprimir() {
    window.print()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Calculadora de INSS <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Renda mensal</label>
              <InputAffix type="number" prefix="R$" min={0} value={renda} onChange={e => setRenda(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <select className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]" value={categoria} onChange={e => setCategoria(e.target.value)}>
                <option value="CLT">CLT</option>
                <option value="MEI">MEI</option>
                <option value="Autônomo">Autônomo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prazo</label>
              <InputAffix type="number" suffix="anos" min={1} max={50} value={anos} onChange={e => setAnos(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="btn btn-outline" onClick={limpar}>Limpar</button>
            <button type="button" className="btn btn-outline" onClick={imprimir}>Imprimir</button>
            <button type="submit" className="btn btn-primary">Calcular</button>
          </div>
        </form>
        {resultado && (
          <>
            <div className="mt-6 bg-neutral-50 rounded-xl p-4 border text-base">
              <div><strong>Contribuição mensal estimada:</strong> R$ {resultado.contribuicao.toLocaleString('pt-BR')}</div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-neutral-800 text-sm">Evolução do total contribuído</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={grafico} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ano" label={{ value: "Ano", position: "insideBottomRight", offset: -4 }} />
                  <YAxis tickFormatter={v => `R$ ${Math.round(v/1000)}k`} />
                  <Tooltip formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR')}`} />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Total contribuído" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-neutral-500">* Gráfico ilustrativo. Valores aproximados, sem reajustes ou atrasos.</div>
            </div>
          </>
        )}
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui cálculo oficial nem aconselhamento previdenciário.<br/>
        Versão BETA — sujeita a ajustes.
      </div>

      {/* Seção explicativa adicional */}
      <section className="mt-12 print:break-before-page text-[15px]">
        <h3 className="font-semibold mb-2 text-base text-neutral-900">Como funciona esta calculadora?</h3>
        <p className="text-xs text-neutral-500 mb-2">
          Esta calculadora de <strong>INSS</strong> estima o valor da contribuição mensal e o total acumulado ao longo dos anos, considerando:
        </p>
        <ul className="list-disc pl-6 text-neutral-500 text-xs mb-2">
          <li>Renda mensal informada.</li>
          <li>Categoria de contribuição (CLT, MEI ou Autônomo).</li>
          <li>Prazo total em anos.</li>
        </ul>
        <p className="text-xs text-neutral-500">
          O gráfico mostra a evolução do total contribuído ao longo do tempo. Não constitui cálculo oficial do INSS. Consulte especialistas para simulações detalhadas.
        </p>
      </section>
    </div>
  )
}