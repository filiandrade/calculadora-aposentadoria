import { useState } from "react"

export default function CltVsPj() {
  const [salarioClt, setSalarioClt] = useState(8000)
  const [beneficios, setBeneficios] = useState(1000)
  const [salarioPj, setSalarioPj] = useState(10000)
  const [custoPj, setCustoPj] = useState(800)
  const [resultado, setResultado] = useState<null | { liquidoClt: number, liquidoPj: number }>(null)

  function calcular() {
    // Cálculo simplificado: CLT desconta 27.5% IR + 8% INSS, PJ desconta custo informado
    const liquidoClt = (salarioClt + beneficios) * 0.645
    const liquidoPj = salarioPj - custoPj
    setResultado({ liquidoClt, liquidoPj })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">CLT vs PJ <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div>
            <label className="block text-xs mb-1">Salário CLT</label>
            <input type="number" className="input input-bordered w-full" min={0} value={salarioClt} onChange={e => setSalarioClt(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs mb-1">Benefícios CLT (vale, plano, etc)</label>
            <input type="number" className="input input-bordered w-full" min={0} value={beneficios} onChange={e => setBeneficios(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs mb-1">Salário PJ</label>
            <input type="number" className="input input-bordered w-full" min={0} value={salarioPj} onChange={e => setSalarioPj(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs mb-1">Custos PJ (impostos, contador, etc)</label>
            <input type="number" className="input input-bordered w-full" min={0} value={custoPj} onChange={e => setCustoPj(Number(e.target.value))} />
          </div>
          <button type="submit" className="btn btn-primary mt-2">Calcular</button>
        </form>
        {resultado && (
          <div className="mt-6 bg-neutral-50 rounded-xl p-4 border text-sm">
            <div><strong>CLT líquido:</strong> R$ {resultado.liquidoClt.toLocaleString('pt-BR')}</div>
            <div><strong>PJ líquido:</strong> R$ {resultado.liquidoPj.toLocaleString('pt-BR')}</div>
            <div className="mt-2 text-xs text-neutral-500">* Simulação simplificada, não considera todos os encargos e benefícios.</div>
          </div>
        )}
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento trabalhista ou fiscal.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}