
import { useState } from "react"
import { InputAffix } from "../components/InputAffix"

export default function AluguelVsFinanciamento() {
  const [valorImovel, setValorImovel] = useState(400000)
  const [entrada, setEntrada] = useState(80000)
  const [taxaJuros, setTaxaJuros] = useState(9)
  const [prazo, setPrazo] = useState(30)
  const [aluguel, setAluguel] = useState(2000)
  const [resultado, setResultado] = useState<null | { totalAluguel: number, totalFinanciamento: number }>(null)

  function calcular() {
    const valorFinanciado = valorImovel - entrada
    const n = prazo * 12
    const i = taxaJuros / 100 / 12
    const parcela = valorFinanciado * i / (1 - Math.pow(1 + i, -n))
    const totalFinanciamento = parcela * n + entrada
    const totalAluguel = aluguel * n
    setResultado({ totalAluguel, totalFinanciamento })
  }

  function limpar() {
    setValorImovel(400000)
    setEntrada(80000)
    setTaxaJuros(9)
    setPrazo(30)
    setAluguel(2000)
    setResultado(null)
  }

  function imprimir() {
    window.print()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900 flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
          <rect x="6" y="12" width="16" height="10" rx="2" fill="#f6f7f9" stroke="#2563eb" strokeWidth="2" />
          <path d="M6 12L14 6L22 12" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Aluguel vs Financiamento
      </h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <form className="grid gap-4" onSubmit={e => { e.preventDefault(); calcular() }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Valor do imóvel</label>
              <InputAffix type="number" prefix="R$" min={10000} step={1000} value={valorImovel} onChange={e => setValorImovel(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Entrada</label>
              <InputAffix type="number" prefix="R$" min={0} step={1000} value={entrada} onChange={e => setEntrada(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Taxa de juros anual</label>
              <InputAffix type="number" suffix="%" min={0} step={0.01} value={taxaJuros} onChange={e => setTaxaJuros(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prazo</label>
              <InputAffix type="number" suffix="anos" min={1} max={40} value={prazo} onChange={e => setPrazo(Number(e.target.value))} className="w-full rounded-md border bg-white pr-10 pl-3 py-2" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Aluguel mensal</label>
              <InputAffix type="number" prefix="R$" min={100} step={10} value={aluguel} onChange={e => setAluguel(Number(e.target.value))} className="w-full rounded-md border bg-white pl-12 pr-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="rounded-full bg-neutral-100 px-5 py-2 text-neutral-700 font-medium border border-neutral-200 shadow-sm hover:bg-neutral-200 transition" onClick={limpar}>Limpar</button>
            <button type="button" className="rounded-full bg-black/90 px-5 py-2 text-white font-medium shadow-sm hover:bg-black transition" onClick={imprimir}>Imprimir</button>
            <button type="submit" className="rounded-full bg-black/90 px-5 py-2 text-white font-medium shadow-sm hover:bg-black transition">Calcular</button>
          </div>
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

      {/* Seção explicativa adicional */}
      <section className="mt-12 print:break-before-page text-[15px]">
        <h3 className="font-semibold mb-2 text-base text-neutral-900">Como funciona esta calculadora?</h3>
        <p className="text-xs text-neutral-500 mb-2">
          Esta calculadora compara o custo total de alugar um imóvel versus financiar, considerando:
        </p>
        <ul className="list-disc pl-6 text-neutral-500 text-xs mb-2">
          <li>Valor do imóvel, entrada e prazo do financiamento.</li>
          <li>Taxa de juros anual aplicada ao financiamento.</li>
          <li>Valor do aluguel mensal ao longo do mesmo período.</li>
          <li>Não considera valorização do imóvel, impostos, taxas extras ou manutenção.</li>
        </ul>
        <p className="text-xs text-neutral-500">
          Os resultados são estimativas simplificadas para ajudar na decisão entre alugar ou financiar. Consulte especialistas para análise detalhada.
        </p>
      </section>
    </div>
  )
}