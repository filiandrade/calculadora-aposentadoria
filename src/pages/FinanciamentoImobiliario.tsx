import { useState } from "react"
import { InputAffix } from "../components/InputAffix"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function FinanciamentoImobiliario() {
  const [valorImovel, setValorImovel] = useState(400000)
  const [entrada, setEntrada] = useState(80000)
  const [taxaJuros, setTaxaJuros] = useState(9)
  const [prazo, setPrazo] = useState(30)
  const [resultado, setResultado] = useState<null | { parcela: number, totalPago: number, totalJuros: number }>(null)
  const [grafico, setGrafico] = useState<{ mes: number, saldoDevedor: number, pago: number }[]>([])

  function calcular() {
    const valorFinanciado = valorImovel - entrada
    const n = prazo * 12
    const i = taxaJuros / 100 / 12
    const parcela = valorFinanciado * i / (1 - Math.pow(1 + i, -n))
    const totalPago = parcela * n + entrada
    const totalJuros = totalPago - valorImovel

    // Geração do gráfico: saldo devedor e total pago ao longo do tempo
    let saldoDevedor = valorFinanciado
    let pago = entrada
    const data = []
    for (let m = 1; m <= n; m++) {
      const jurosMes = saldoDevedor * i
      const amortizacao = parcela - jurosMes
      saldoDevedor -= amortizacao
      pago += parcela
      data.push({ mes: m, saldoDevedor: Math.max(saldoDevedor, 0), pago })
    }
    setResultado({ parcela, totalPago, totalJuros })
    setGrafico(data)
  }

  function limpar() {
    setValorImovel(400000)
    setEntrada(80000)
    setTaxaJuros(9)
    setPrazo(30)
    setResultado(null)
    setGrafico([])
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
        Financiamento Imobiliário
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
              <div><strong>Parcela estimada:</strong> R$ {resultado.parcela.toLocaleString('pt-BR')}</div>
              <div><strong>Total pago:</strong> R$ {resultado.totalPago.toLocaleString('pt-BR')}</div>
              <div><strong>Total de juros:</strong> R$ {resultado.totalJuros.toLocaleString('pt-BR')}</div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-neutral-800 text-sm">Evolução do saldo devedor e total pago</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={grafico} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" label={{ value: "Meses", position: "insideBottomRight", offset: -4 }} />
                  <YAxis tickFormatter={v => `R$ ${Math.round(v/1000)}k`} />
                  <Tooltip formatter={(val: number, name: string) => [`R$ ${val.toLocaleString('pt-BR')}`, name === 'saldoDevedor' ? 'Saldo devedor' : 'Total pago']} labelFormatter={l => `Mês: ${l}`} />
                  <Legend verticalAlign="top" height={36} formatter={v => v === 'saldoDevedor' ? 'Saldo devedor' : 'Total pago'} />
                  <Line type="monotone" dataKey="saldoDevedor" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Saldo devedor" />
                  <Line type="monotone" dataKey="pago" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Total pago" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-neutral-500">* Gráfico ilustrativo. Valores aproximados, sem seguros ou taxas extras.</div>
            </div>
          </>
        )}
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro.<br/>
        Versão BETA — sujeita a ajustes.
      </div>

      {/* Seção explicativa adicional */}
      <section className="mt-12 print:break-before-page text-[15px]">
        <h3 className="font-semibold mb-2 text-base text-neutral-900">Como funciona esta calculadora?</h3>
        <p className="text-xs text-neutral-500 mb-2">
          Esta calculadora de <strong>Financiamento Imobiliário</strong> estima o valor das parcelas, total pago e juros ao longo do tempo, considerando:
        </p>
        <ul className="list-disc pl-6 text-neutral-500 text-xs mb-2">
          <li>Valor do imóvel e entrada inicial.</li>
          <li>Taxa de juros anual aplicada ao financiamento.</li>
          <li>Prazo total em anos.</li>
        </ul>
        <p className="text-xs text-neutral-500">
          O gráfico mostra a evolução do saldo devedor e do total pago mês a mês. Não considera seguros, taxas extras ou amortizações antecipadas. Consulte especialistas para análise detalhada.
        </p>
      </section>
    </div>
  )
}