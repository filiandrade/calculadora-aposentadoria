import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function CltVsPj() {
  const [salarioClt, setSalarioClt] = useState(8000)
  const [beneficios, setBeneficios] = useState(1000)
  const [salarioPj, setSalarioPj] = useState(10000)
  const [custoPj, setCustoPj] = useState(800)
  const [resultado, setResultado] = useState<null | { liquidoClt: number, liquidoPj: number }>(null)
  const [grafico, setGrafico] = useState<{ tipo: string, valor: number }[]>([])

  function calcular() {
    // Cálculo simplificado: CLT desconta 27.5% IR + 8% INSS, PJ desconta custo informado
    const liquidoClt = (salarioClt + beneficios) * 0.645
    const liquidoPj = salarioPj - custoPj
    setResultado({ liquidoClt, liquidoPj })
    setGrafico([
      { tipo: 'CLT', valor: liquidoClt },
      { tipo: 'PJ', valor: liquidoPj }
    ])
  }

  function limpar() {
    setSalarioClt(8000)
    setBeneficios(1000)
    setSalarioPj(10000)
    setCustoPj(800)
    setResultado(null)
    setGrafico([])
  }

  function imprimir() {
    window.print()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">CLT vs PJ <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1">Salário CLT (R$)</label>
              <input type="number" className="input input-bordered w-full" min={0} value={salarioClt} onChange={e => setSalarioClt(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs mb-1">Benefícios CLT (R$)</label>
              <input type="number" className="input input-bordered w-full" min={0} value={beneficios} onChange={e => setBeneficios(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs mb-1">Salário PJ (R$)</label>
              <input type="number" className="input input-bordered w-full" min={0} value={salarioPj} onChange={e => setSalarioPj(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs mb-1">Custos PJ (R$)</label>
              <input type="number" className="input input-bordered w-full" min={0} value={custoPj} onChange={e => setCustoPj(Number(e.target.value))} />
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
              <div><strong>CLT líquido:</strong> R$ {resultado.liquidoClt.toLocaleString('pt-BR')}</div>
              <div><strong>PJ líquido:</strong> R$ {resultado.liquidoPj.toLocaleString('pt-BR')}</div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-neutral-800 text-sm">Comparativo líquido</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={grafico} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis tickFormatter={v => `R$ ${Math.round(v/1000)}k`} />
                  <Tooltip formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR')}`} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="valor" fill="#2563eb" name="Valor líquido" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-neutral-500">* Simulação simplificada, não considera todos os encargos e benefícios.</div>
            </div>
          </>
        )}
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento trabalhista ou fiscal.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}