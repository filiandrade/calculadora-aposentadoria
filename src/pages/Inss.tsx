import { useState } from "react"

export default function Inss() {
  const [renda, setRenda] = useState(3000)
  const [categoria, setCategoria] = useState("CLT")
  const [resultado, setResultado] = useState<null | { contribuicao: number }>(null)

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
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Calculadora de INSS <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div>
            <label className="block text-xs mb-1">Renda mensal</label>
            <input type="number" className="input input-bordered w-full" min={0} value={renda} onChange={e => setRenda(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs mb-1">Categoria</label>
            <select className="input input-bordered w-full" value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option value="CLT">CLT</option>
              <option value="MEI">MEI</option>
              <option value="Autônomo">Autônomo</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary mt-2">Calcular</button>
        </form>
        {resultado && (
          <div className="mt-6 bg-neutral-50 rounded-xl p-4 border text-sm">
            <div><strong>Contribuição mensal estimada:</strong> R$ {resultado.contribuicao.toLocaleString('pt-BR')}</div>
            <div className="mt-2 text-xs text-neutral-500">* Simulação simplificada, não substitui cálculo oficial do INSS.</div>
          </div>
        )}
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui cálculo oficial nem aconselhamento previdenciário.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}