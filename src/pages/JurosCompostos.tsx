import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function JurosCompostos() {

  const [valorInicial, setValorInicial] = useState(1000)
  const [aporteMensal, setAporteMensal] = useState(1000)
  const [taxa, setTaxa] = useState(10)
  const [anos, setAnos] = useState(20)
  const [resultado, setResultado] = useState<null | { total: number, investido: number, juros: number }>(null)
  const [grafico, setGrafico] = useState<any[]>([])

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
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Juros Compostos <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1">Valor inicial (R$)</label>
              <input type="number" className="input input-bordered w-full" min={0} value={valorInicial} onChange={e => setValorInicial(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs mb-1">Aporte mensal (R$)</label>
              <input type="number" className="input input-bordered w-full" min={0} value={aporteMensal} onChange={e => setAporteMensal(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs mb-1">Taxa de juros anual (%)</label>
              <input type="number" className="input input-bordered w-full" min={0} step={0.01} value={taxa} onChange={e => setTaxa(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs mb-1">Prazo (anos)</label>
              <input type="number" className="input input-bordered w-full" min={1} max={50} value={anos} onChange={e => setAnos(Number(e.target.value))} />
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
              <div><strong>Total acumulado:</strong> R$ {resultado.total.toLocaleString('pt-BR')}</div>
              <div><strong>Total investido:</strong> R$ {resultado.investido.toLocaleString('pt-BR')}</div>
              <div><strong>Juros ganhos:</strong> R$ {resultado.juros.toLocaleString('pt-BR')}</div>
            </div>
            <div className="mt-6">
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
    </div>
  )
}