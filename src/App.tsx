import { useMemo, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts"

/* ===== Helpers de formatação ===== */
const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))

/* ===== Inputs com prefixo/sufixo ===== */
function MoneyInput({
  label, value, onChange, id,
}: { label: string; value: number; onChange: (v:number)=>void; id: string }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 select-none">R$</span>
        <input
          id={id}
          inputMode="numeric"
          className="w-full rounded-md border bg-white pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          value={value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
          onChange={(e)=> onChange(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
        />
      </div>
    </label>
  )
}
function PercentInput({
  label, value, onChange, id,
}: { label: string; value: number; onChange:(v:number)=>void; id:string }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative">
        <input
          id={id}
          inputMode="decimal"
          className="w-full rounded-md border bg-white pr-8 pl-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          value={value}
          onChange={(e)=> onChange(Number(e.target.value.replace(",", ".")) || 0)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 select-none">%</span>
      </div>
    </label>
  )
}
function NumberInput({
  label, value, onChange, id,
}: { label: string; value: number; onChange:(v:number)=>void; id:string }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium">{label}</span>
      <input
        id={id}
        inputMode="numeric"
        className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
        value={value}
        onChange={(e)=> onChange(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
      />
    </label>
  )
}

/* ===== Cálculo principal ===== */
const TAXA_RETIRADA = 0.04 // 4% a.a. (FIRE)

export default function App() {
  // Entradas (valores “de hoje”)
  const [rendaMensal, setRendaMensal] = useState(15000)
  const [investido, setInvestido] = useState(150000)
  const [alvoPatrimonio, setAlvoPatrimonio] = useState(1000000) // opcional
  const [percInvestRenda, setPercInvestRenda] = useState(5) // %
  const [idadeAtual, setIdadeAtual] = useState(37)
  const [idadeApos, setIdadeApos] = useState(65)
  const [gastoMensal, setGastoMensal] = useState(5000)
  const [retornoNominalAA, setRetornoNominalAA] = useState(10) // %
  const [inflacaoAA, setInflacaoAA] = useState(5) // %

  const anos = useMemo(()=> clamp(idadeApos - idadeAtual, 0, 80), [idadeApos, idadeAtual])
  const aporteMensal = useMemo(()=> Math.round(rendaMensal * (percInvestRenda/100)), [rendaMensal, percInvestRenda])

  // rentabilidade REAL = retorno esperado – inflação
  const rentRealAA = useMemo(()=> (retornoNominalAA - inflacaoAA)/100, [retornoNominalAA, inflacaoAA])

  // Projeção com capitalização mensal
  const saldoProjetado = useMemo(()=>{
    const i = Math.pow(1 + rentRealAA, 1/12) - 1 // taxa mensal real
    const n = anos * 12
    let saldo = investido
    for (let m=0; m<n; m++) {
      saldo = saldo * (1 + i) + aporteMensal
    }
    return Math.max(0, saldo)
  }, [investido, anos, rentRealAA, aporteMensal])

  // Meta FIRE (se não houver alvo informado, usa FIRE baseado no gasto)
  const necessario = useMemo(()=>{
    const base = alvoPatrimonio > 0 ? alvoPatrimonio : (gastoMensal * 12) / TAXA_RETIRADA
    return Math.max(0, base)
  }, [alvoPatrimonio, gastoMensal])

  const podeGastarMes = useMemo(()=> (saldoProjetado * TAXA_RETIRADA) / 12, [saldoProjetado])
  const diff = saldoProjetado - necessario
  const atingiu = diff >= 0

  // >>> Série anual para o gráfico (X = IDADE) <<<
  const chartData = useMemo(()=>{
    const pontos: { idade: number; saldo: number }[] = []
    const i = Math.pow(1 + rentRealAA, 1/12) - 1
    let s = investido

    // ponto inicial = idade atual
    pontos.push({ idade: idadeAtual, saldo: s })

    // a cada ano, acumula 12 meses e adiciona ponto com a IDADE correspondente
    for (let idade = idadeAtual + 1; idade <= idadeApos; idade++) {
      for (let m = 0; m < 12; m++) {
        s = s * (1 + i) + aporteMensal
      }
      pontos.push({ idade, saldo: Math.max(0, s) })
    }
    return pontos
  }, [idadeAtual, idadeApos, investido, rentRealAA, aporteMensal])

  // Ações
  const limpar = () => {
    setRendaMensal(15000)
    setInvestido(150000)
    setAlvoPatrimonio(1000000)
    setPercInvestRenda(5)
    setIdadeAtual(37)
    setIdadeApos(65)
    setGastoMensal(5000)
    setRetornoNominalAA(10)
    setInflacaoAA(5)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const imprimir = () => window.print()
  const bumpReal = (deltaPP: number) =>
    setRetornoNominalAA(clamp(retornoNominalAA + deltaPP, -50, 100))

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">
            Cálculo de Liberdade Financeira na Aposentadoria
          </h1>
          <div className="ml-auto flex gap-2">
            <button
              onClick={imprimir}
              className="rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-white hover:brightness-110"
            >
              Imprimir
            </button>
            <button
              onClick={limpar}
              className="rounded-md bg-slate-200 px-4 py-2 hover:brightness-110"
            >
              Limpar
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Valores em <strong>R$ de hoje</strong>. Rentabilidade real usada =
          {" "}
          <strong>{retornoNominalAA}% − {inflacaoAA}% = {(rentRealAA*100).toFixed(1)}% a.a.</strong>
          {" · "}Regra FIRE (retirada): <strong>4,0% a.a.</strong>
        </p>
      </header>

      {/* Formulário */}
      <section className="grid gap-4 md:grid-cols-2">
        <MoneyInput id="renda" label="Quanto você ganha por mês?" value={rendaMensal} onChange={setRendaMensal}/>
        <MoneyInput id="inv" label="Quanto você já tem investido?" value={investido} onChange={setInvestido}/>
        <MoneyInput id="alvo" label="Com quanto de patrimônio quer se aposentar? (opcional)" value={alvoPatrimonio} onChange={setAlvoPatrimonio}/>
        <PercentInput id="perc" label="Quantos % da renda você investe?" value={percInvestRenda} onChange={(v)=>setPercInvestRenda(clamp(v,0,100))}/>
        <NumberInput id="idade" label="Qual sua idade atual" value={idadeAtual} onChange={(v)=>setIdadeAtual(clamp(v,0,100))}/>
        <NumberInput id="apos" label="Com quantos anos deseja se aposentar?" value={idadeApos} onChange={(v)=>setIdadeApos(clamp(v,0,100))}/>
        <PercentInput id="ret" label="Retorno esperado (a.a.)" value={retornoNominalAA} onChange={(v)=>setRetornoNominalAA(clamp(v,-50,100))}/>
        <PercentInput id="inf" label="Inflação esperada (a.a.)" value={inflacaoAA} onChange={(v)=>setInflacaoAA(clamp(v,-10,50))}/>
        <MoneyInput id="gasto" label="Quanto pretende gastar por mês aposentado?" value={gastoMensal} onChange={setGastoMensal}/>
      </section>

      {/* Resultado */}
      <section className="mt-6">
        <div className={`rounded-md border px-4 py-3 ${atingiu ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          {atingiu
            ? <>Parabéns! Você já atinge a meta com os investimentos atuais.</>
            : <>Ainda não atinge a meta: ajuste aportes/retorno ou prazo para chegar lá.</>}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-600">Aporte estimado por mês</div>
            <div className="mt-2 text-2xl font-semibold">{fmtBRL(aporteMensal)}</div>
            <div className="text-xs text-slate-500">
              (R$ {rendaMensal.toLocaleString("pt-BR")} × {percInvestRenda}%)
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-600">Você se aposentará com</div>
            <div className="mt-2 text-2xl font-semibold">{fmtBRL(Math.round(saldoProjetado))}</div>
            <div className="text-xs text-slate-500">
              {anos} anos acumulando a {(rentRealAA*100).toFixed(1)}% a.a. real
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-600">Poderá gastar por mês (regra 4%)</div>
            <div className="mt-2 text-2xl font-semibold">{fmtBRL(Math.round(podeGastarMes))}</div>
            <div className="text-xs text-slate-500">Com base no patrimônio projetado</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border p-4">
          <div className="text-sm text-slate-600">
            Meta considerada: {alvoPatrimonio > 0 ? "alvo informado" : "FIRE (gasto × 12 ÷ 4%)"}
          </div>
          <div className={`text-lg font-semibold ${atingiu ? "text-emerald-700" : "text-amber-700"}`}>
            {atingiu ? `Você passou da meta em ${fmtBRL(diff)}.` : `Faltam ${fmtBRL(-diff)} para atingir a meta.`}
          </div>
        </div>
      </section>

      {/* Controles de sensibilidade + Gráfico */}
      <section className="mt-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-700">
            Evolução do patrimônio (R$ de hoje) — rentabilidade real:{" "}
            <strong>{(rentRealAA*100).toFixed(1)}% a.a.</strong>
          </span>
          <div className="ml-auto flex gap-2">
            <button className="tweak-btn" onClick={()=>bumpReal(-1)}>−1% retorno</button>
            <button className="tweak-btn" onClick={()=>bumpReal(+1)}>+1% retorno</button>
          </div>
        </div>

        <div className="h-64 w-full rounded-xl border bg-white p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              {/* >>> X = IDADE <<< */}
              <XAxis dataKey="idade" label={{ value: "Idade", position: "insideBottomRight", offset: -4 }} />
              <YAxis tickFormatter={(v)=> (v/1000).toFixed(0)+"k"} width={50} />
              <Tooltip
                formatter={(val)=>[fmtBRL(Number(val)), "Saldo"]}
                labelFormatter={(l)=>`Idade: ${l} anos`}
              />
              <Line type="monotone" dataKey="saldo" stroke="#165788" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Explicação FIRE (simples) */}
      <section className="mt-8 rounded-xl border p-4 bg-slate-50">
        <h3 className="font-semibold mb-1">O que é FIRE?</h3>
        <p className="text-sm text-slate-600">
          <strong>FIRE</strong> (Financial Independence, Retire Early) é um método prático para estimar o patrimônio necessário
          para viver de renda. A regra comum é retirar cerca de <strong>4% ao ano</strong> do patrimônio (em valores reais).
          Assim, para um gasto anual de {fmtBRL(gastoMensal*12)}, o patrimônio alvo seria ≈ {fmtBRL((gastoMensal*12)/TAXA_RETIRADA)}.
        </p>
      </section>

      <div className="mt-6 text-xs text-slate-500 print:block">
        Projeções educativas. Não constitui aconselhamento financeiro, previdenciário ou jurídico.
      </div>
    </div>
  )
}
