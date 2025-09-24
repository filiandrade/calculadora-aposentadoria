import { useState } from "react"

export default function AluguelVsFinanciamento() {
  const [valorImovel, setValorImovel] = useState(400000)
  const [entrada, setEntrada] = useState(80000)
  const [taxaJuros, setTaxaJuros] = useState(9)
  const [prazo, setPrazo] = useState(30)
  const [aluguel, setAluguel] = useState(2000)
  const [resultado, setResultado] = useState<null | { totalAluguel: number, totalFinanciamento: number }>(null)

  function calcular() {
    // Cálculo simplificado: financiamento SAC, sem amortização extra
    const valorFinanciado = valorImovel - entrada
    const n = prazo * 12
    const i = taxaJuros / 100 / 12
    const parcela = valorFinanciado * i / (1 - Math.pow(1 + i, -n))
    const totalFinanciamento = parcela * n + entrada
    const totalAluguel = aluguel * n
    setResultado({ totalAluguel, totalFinanciamento })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Aluguel vs Financiamento <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div>
            <label className="block text-xs mb-1">Valor do imóvel</label>
            <input type="number" className="input input-bordered w-full" min={10000} step={1000} value={valorImovel} onChange={e => setValorImovel(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs mb-1">Entrada</label>
            <input type="number" className="input input-bordered w-full" min={0} step={1000} value={entrada} onChange={e => setEntrada(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs mb-1">Taxa de juros anual (%)</label>
            <input type="number" className="input input-bordered w-full" min={0} step={0.01} value={taxaJuros} onChange={e => setTaxaJuros(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs mb-1">Prazo (anos)</label>
            <input type="number" className="input input-bordered w-full" min={1} max={40} value={prazo} onChange={e => setPrazo(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs mb-1">Aluguel mensal</label>
            <input type="number" className="input input-bordered w-full" min={100} step={10} value={aluguel} onChange={e => setAluguel(Number(e.target.value))} />
          </div>
          <button type="submit" className="btn btn-primary mt-2">Calcular</button>
        </form>
        {resultado && (
          <div className="mt-6 bg-neutral-50 rounded-xl p-4 border text-sm">
            <div><strong>Total pago em aluguel:</strong> R$ {resultado.totalAluguel.toLocaleString('pt-BR')}</div>
            <div><strong>Total pago no financiamento:</strong> R$ {resultado.totalFinanciamento.toLocaleString('pt-BR')}</div>
            <div className="mt-2 text-xs text-neutral-500">* Cálculo simplificado, não considera valorização, impostos ou manutenção.</div>
          </div>
        )}
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro ou imobiliário.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}