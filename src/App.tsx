import React, { useMemo, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

/** Formatadores */
const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const pct = (v: number) =>
  `${v.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`

/** Input com prefixo R$ (sem centavos) */
function MoneyInput({
  label, value, onChange, placeholder = '0', id,
}: { label: string; value: number; onChange: (v: number) => void; placeholder?: string; id: string }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none">R$</span>
        <input
          id={id}
          inputMode="numeric"
          className="w-full rounded-md border bg-white pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          value={value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          placeholder={placeholder}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d]/g, '')
            onChange(Number(raw || 0))
          }}
        />
      </div>
    </label>
  )
}

/** Input com sufixo %  */
function PercentInput({
  label, value, onChange, id,
}: { label: string; value: number; onChange: (v: number) => void; id: string }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative">
        <input
          id={id}
          inputMode="decimal"
          className="w-full rounded-md border bg-white pr-9 pl-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          value={value}
          onChange={(e) => onChange(Number(e.target.value.replace(',', '.')) || 0)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none">%</span>
      </div>
    </label>
  )
}

/** Input numérico “simples” */
function NumberInput({
  label, value, onChange, id, placeholder,
}: { label: string; value: number; onChange: (v: number) => void; id: string; placeholder?: string }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium">{label}</span>
      <input
        id={id}
        inputMode="numeric"
        className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value.replace(/[^\d]/g, '')) || 0)}
      />
    </label>
  )
}

/** Cálculos principais (rentabilidade real = retorno esperado – inflação) */
function useCalcs({
  rendaMensal, investido, alvoPatrimonio, percRendaInvestida,
  idadeAtual, idadeAposentadoria, retornoNominalAA, inflacaoAA, gastoMensal,
}: {
  rendaMensal: number
  investido: number
  alvoPatrimonio: number
  percRendaInvestida: number
  idadeAtual: number
  idadeAposentadoria: number
  retornoNominalAA: number
  inflacaoAA: number
  gastoMensal: number
}) {
  return useMemo(() => {
    const anos = Math.max(0, idadeAposentadoria - idadeAtual)
    const aporteMensal = Math.round((rendaMensal * percRendaInvestida) / 100)
    const rReal = (retornoNominalAA - inflacaoAA) / 100 // simplificação solicitada

    // crescimento anual (para gráfico e FV)
    const r = rReal
    const contribAnual = aporteMensal * 12

    // FV anual fechado (série uniforme) + valor inicial
    const pow = Math.pow(1 + r, anos)
    const fvInvest = investido * pow + (r === 0 ? contribAnual * anos : contribAnual * (pow - 1) / r)

    // Regra FIRE (4% a.a.) para “quanto preciso”
    const taxaRetirada = 0.04
    const necessario = (gastoMensal * 12) / taxaRetirada

    // Pode gastar por mês com o FV calculado:
    const podeGastarMes = (fvInvest * taxaRetirada) / 12

    // gráfico ano a ano
    const chart: { ano: number; saldo: number }[] = []
    let saldo = investido
    for (let i = 0; i <= anos; i++) {
      if (i > 0) saldo = saldo * (1 + r) + contribAnual
      chart.push({ ano: i, saldo: Math.max(saldo, 0) })
    }

    const atingiu = fvInvest >= necessario

    return {
      anos,
      aporteMensal,
      rReal,
      fvInvest,
      necessario,
      podeGastarMes,
      chart,
      atingiu,
    }
  }, [
    rendaMensal, investido, alvoPatrimonio, percRendaInvestida,
    idadeAtual, idadeAposentadoria, retornoNominalAA, inflacaoAA, gastoMensal,
  ])
}

export default function App() {
  const [rendaMensal, setRendaMensal] = useState(15000)
  const [investido, setInvestido] = useState(150000)
  const [alvoPatrimonio, setAlvoPatrimonio] = useState(1000000) // opcional
  const [percRendaInvestida, setPercRendaInvestida] = useState(5)
  const [idadeAtual, setIdadeAtual] = useState(37)
  const [idadeAposentadoria, setIdadeAposentadoria] = useState(65)
  const [retornoNominalAA, setRetornoNominalAA] = useState(10)
  const [inflacaoAA, setInflacaoAA] = useState(5)
  const [gastoMensal, setGastoMensal] = useState(5000)

  const { anos, aporteMensal, rReal, fvInvest, necessario, podeGastarMes, chart, atingiu } = useCalcs({
    rendaMensal, investido, alvoPatrimonio, percRendaInvestida,
    idadeAtual, idadeAposentadoria, retornoNominalAA, inflacaoAA, gastoMensal,
  })

  const limpar = () => {
    setRendaMensal(15000)
    setInvestido(150000)
    setAlvoPatrimonio(1000000)
    setPercRendaInvestida(5)
    setIdadeAtual(37)
    setIdadeAposentadoria(65)
    setRetornoNominalAA(10)
    setInflacaoAA(5)
    setGastoMensal(5000)
  }

  const imprimir = () => window.print()

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Cálculo de Liberdade Financeira na Aposentadoria</h1>
        <p className="text-sm text-muted-foreground">
          Simule aportes, retorno e gasto desejado. Os valores são em <strong>R$ de hoje</strong>.
          A rentabilidade <em>real</em> usada nos cálculos é <strong>retorno esperado – inflação</strong>.
          Regra FIRE (retirada) usada: <strong>4,0% a.a.</strong>
        </p>
      </header>

      {/* Controles principais */}
      <section className="grid gap-4 md:grid-cols-2">
        <MoneyInput id="renda" label="Quanto você ganha por mês?" value={rendaMensal} onChange={setRendaMensal} />
        <MoneyInput id="investido" label="Quanto você já tem investido?" value={investido} onChange={setInvestido} />
        <MoneyInput id="alvo" label="Com quanto de patrimônio você quer se aposentar? (opcional)" value={alvoPatrimonio} onChange={setAlvoPatrimonio} />
        <PercentInput id="perc" label="Quantos % da sua renda você investe?" value={percRendaInvestida} onChange={setPercRendaInvestida} />
        <NumberInput id="idade" label="Qual sua idade atual" value={idadeAtual} onChange={setIdadeAtual} />
        <NumberInput id="idade-apos" label="Com quantos anos você deseja se aposentar?" value={idadeAposentadoria} onChange={setIdadeAposentadoria} />
        <PercentInput id="ret" label="Retorno esperado (a.a.)" value={retornoNominalAA} onChange={setRetornoNominalAA} />
        <PercentInput id="inf" label="Inflação esperada (a.a.)" value={inflacaoAA} onChange={setInflacaoAA} />
        <MoneyInput id="gasto" label="Quanto você pretende gastar por mês aposentado?" value={gastoMensal} onChange={setGastoMensal} />
      </section>

      {/* Botões utilitários e tweaks de +1%/-1% */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button className="tweak-btn" onClick={() => setRetornoNominalAA(retornoNominalAA + 1)}>+1% retorno</button>
        <button className="tweak-btn" onClick={() => setRetornoNominalAA(Math.max(0, retornoNominalAA - 1))}>-1% retorno</button>
        <span className="ml-2 text-sm text-muted-foreground">Rentabilidade real atual: <strong>{pct(Math.max(0, retornoNominalAA - inflacaoAA))}</strong> a.a.</span>

        <div className="ml-auto flex gap-2">
          <button onClick={imprimir} className="rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-white hover:brightness-110">Imprimir</button>
          <button onClick={limpar} className="rounded-md bg-slate-200 px-4 py-2 hover:brightness-110">Limpar</button>
        </div>
      </div>

      {/* Resultado / Mensagens */}
      <section className="mt-6">
        <div className={`rounded-md border px-4 py-3 ${atingiu ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          {atingiu ? (
            <>Parabéns! Você já atinge a meta de aposentadoria com os investimentos atuais.</>
          ) : (
            <>Você ainda não atinge a meta com os parâmetros atuais. Ajuste aportes/retorno ou gasto mensal desejado.</>
          )}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4">
            <div className="text-sm text-muted-foreground">Aporte estimado por mês</div>
            <div className="mt-2 text-2xl font-semibold">{brl(aporteMensal)}</div>
            <div className="text-xs text-muted-foreground">(R$ {brl(rendaMensal).replace('R$ ', '')} × {pct(percRendaInvestida)})</div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="text-sm text-muted-foreground">Você se aposentará com</div>
            <div className="mt-2 text-2xl font-semibold">{brl(Math.round(fvInvest))}</div>
            <div className="text-xs text-muted-foreground">{anos} anos acumulando a {pct(Math.max(0, retornoNominalAA - inflacaoAA))} real.</div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="text-sm text-muted-foreground">Poderá gastar por mês (regra 4,0%)</div>
            <div className="mt-2 text-2xl font-semibold">{brl(Math.round(podeGastarMes))}</div>
            <div className="text-xs text-muted-foreground">Com base no patrimônio projetado.</div>
          </div>
        </div>
      </section>

      {/* Gráfico */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Evolução do patrimônio até a aposentadoria</h2>
        <div className="h-64 w-full rounded-xl border bg-white p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart} margin={{ left: 4, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => brl(v).replace('R$', 'R$ ')} width={90} />
              <Tooltip formatter={(value: number) => [brl(value as number), 'Saldo']} labelFormatter={(l) => `${l} ano(s)`} />
              <Line type="monotone" dataKey="saldo" stroke="#165788" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Explicação FIRE (simples e em PT-BR) */}
      <section className="mt-8 rounded-xl border p-4 bg-slate-50">
        <h3 className="font-semibold mb-2">O que é FIRE?</h3>
        <p className="text-sm text-muted-foreground">
          <strong>FIRE</strong> (Financial Independence, Retire Early) é um método simples para estimar o patrimônio necessário
          para viver de renda. A regra mais usada supõe uma <strong>retirada segura de 4% ao ano</strong> do patrimônio.
          Assim, para sustentar um gasto anual de <em>{brl(gastoMensal * 12)}</em>, o patrimônio alvo seria
          aproximadamente <em>{brl((gastoMensal * 12) / 0.04)}</em>.
        </p>
      </section>
    </div>
  )
}
