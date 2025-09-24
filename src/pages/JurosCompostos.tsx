import { useState } from "react"

export default function JurosCompostos() {
  const [valorInicial, setValorInicial] = useState(1000)
  const [aporteMensal, setAporteMensal] = useState(1000)
  const [taxa, setTaxa] = useState(10)
  const [anos, setAnos] = useState(20)
  const [resultado, setResultado] = useState<null | { total: number, investido: number, juros: number }>(null)

  function calcular() {
    const meses = anos * 12
    const i = taxa / 100 / 12
    let saldo = valorInicial
    let investido = valorInicial
    for (let m = 1; m <= meses; m++) {
      saldo = saldo * (1 + i) + aporteMensal
      investido += aporteMensal
    }
    const juros = saldo - investido
    setResultado({ total: saldo, investido, juros })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Juros Compostos <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div>
            <label className="block text-xs mb-1">Valor inicial</label>
            <input type="number" className="input input-bordered w-full" min={0} value={valorInicial} onChange={e => setValorInicial(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs mb-1">Aporte mensal</label>
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
          <button type="submit" className="btn btn-primary mt-2">Calcular</button>
        </form>
        {resultado && (
          <div className="mt-6 bg-neutral-50 rounded-xl p-4 border text-sm">
            <div><strong>Total acumulado:</strong> R$ {resultado.total.toLocaleString('pt-BR')}</div>
            <div><strong>Total investido:</strong> R$ {resultado.investido.toLocaleString('pt-BR')}</div>
            <div><strong>Juros ganhos:</strong> R$ {resultado.juros.toLocaleString('pt-BR')}</div>
            <div className="mt-2 text-xs text-neutral-500">* Simulação simplificada, não considera impostos ou taxas.</div>
          </div>
        )}
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}