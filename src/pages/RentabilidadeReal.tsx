import { useState } from "react"

export default function RentabilidadeReal() {
  const [rendimento, setRendimento] = useState(8)
  const [inflacao, setInflacao] = useState(4)
  const [resultado, setResultado] = useState<null | { real: number }>(null)

  function calcular() {
    const real = ((1 + rendimento / 100) / (1 + inflacao / 100) - 1) * 100
    setResultado({ real })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Rentabilidade Real <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div>
            <label className="block text-xs mb-1">Rendimento bruto (%)</label>
            <input type="number" className="input input-bordered w-full" min={-100} step={0.01} value={rendimento} onChange={e => setRendimento(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs mb-1">Inflação (%)</label>
            <input type="number" className="input input-bordered w-full" min={-100} step={0.01} value={inflacao} onChange={e => setInflacao(Number(e.target.value))} />
          </div>
          <button type="submit" className="btn btn-primary mt-2">Calcular</button>
        </form>
        {resultado && (
          <div className="mt-6 bg-neutral-50 rounded-xl p-4 border text-sm">
            <div><strong>Rentabilidade real:</strong> {resultado.real.toFixed(2)}%</div>
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