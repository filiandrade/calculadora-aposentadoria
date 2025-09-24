import { useEffect, useMemo, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts"

/* ===== Helpers ===== */
const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })

/** Eixo Y compacto: "R$ 250 mil" / "R$ 1,2 mi" */
function fmtCompactBRL(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) {
    const v = n / 1_000_000
    return `R$ ${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`
  }
  if (abs >= 1_000) {
    const v = n / 1_000
    return `R$ ${v.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} mil`
  }
  return `R$ ${n.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`
}

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

/** Input especial para "Até que idade pretende viver?" — não força valor enquanto digita */
function LifeAgeInput({
  label, value, onCommit, min, max, id,
}: { label: string; value: number; onCommit:(v:number)=>void; min:number; max:number; id:string }) {
  const [text, setText] = useState(String(value))
  useEffect(() => { setText(String(value)) }, [value])

  const commit = () => {
    const raw = Number(text.replace(/[^\d]/g, "")) || min
    onCommit(clamp(raw, min, max))
  }

  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium">{label}</span>
      <input
        id={id}
        inputMode="numeric"
        className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
        value={text}
        onChange={(e)=> setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e)=> { if (e.key === "Enter") { (e.target as HTMLInputElement).blur() } }}
      />
    </label>
  )
}

/* ===== Parâmetros ===== */
const TAXA_RETIRADA = 0.04 // 4% a.a. (FIRE) — saque real anual fixo no pós-aposentadoria

type MetodoSaque = "fire4" | "gasto"

/* ===== App ===== */

type Perfil = 'jovem' | 'adulto' | 'terceiraIdade';

const perfis = {
  jovem: {
    rendaMensal: 3500,
    investido: 10000,
    alvoPatrimonio: 1000000,
    percInvestRenda: 15,
    idadeAtual: 24,
    idadeApos: 68,
    idadeVida: 85,
    gastoMensal: 2500,
    retornoNominalAA: 12,
    inflacaoAA: 5,
  },
  adulto: {
    rendaMensal: 12000,
    investido: 120000,
    alvoPatrimonio: 1000000,
    percInvestRenda: 8,
    idadeAtual: 38,
    idadeApos: 68,
    idadeVida: 85,
    gastoMensal: 6000,
    retornoNominalAA: 9,
    inflacaoAA: 5,
  },
  terceiraIdade: {
    rendaMensal: 8000,
    investido: 400000,
    alvoPatrimonio: 1000000,
    percInvestRenda: 3,
    idadeAtual: 62,
    idadeApos: 68,
    idadeVida: 85,
    gastoMensal: 7000,
    retornoNominalAA: 6,
    inflacaoAA: 5,
  },
};

export default function App() {
  // Seleção de perfil
  const [perfil, setPerfil] = useState<Perfil>('adulto');
  // Entradas (valores “de hoje”)
  const [rendaMensal, setRendaMensal] = useState(perfis[perfil].rendaMensal);
  const [investido, setInvestido] = useState(perfis[perfil].investido);
  const [alvoPatrimonio, setAlvoPatrimonio] = useState(perfis[perfil].alvoPatrimonio);
  const [percInvestRenda, setPercInvestRenda] = useState(perfis[perfil].percInvestRenda);
  const [idadeAtual, setIdadeAtual] = useState(perfis[perfil].idadeAtual);
  const [idadeApos, setIdadeApos] = useState(perfis[perfil].idadeApos);
  const [idadeVida, setIdadeVida] = useState(perfis[perfil].idadeVida);
  const [gastoMensal, setGastoMensal] = useState(perfis[perfil].gastoMensal);
  const [retornoNominalAA, setRetornoNominalAA] = useState(perfis[perfil].retornoNominalAA);
  const [inflacaoAA, setInflacaoAA] = useState(perfis[perfil].inflacaoAA);
  const [metodoSaque, setMetodoSaque] = useState<MetodoSaque>("fire4");

  // Atualiza valores ao trocar perfil
  useEffect(() => {
    setRendaMensal(perfis[perfil].rendaMensal);
    setInvestido(perfis[perfil].investido);
    setAlvoPatrimonio(perfis[perfil].alvoPatrimonio);
    setPercInvestRenda(perfis[perfil].percInvestRenda);
    setIdadeAtual(perfis[perfil].idadeAtual);
    setIdadeApos(perfis[perfil].idadeApos);
    setIdadeVida(perfis[perfil].idadeVida);
    setGastoMensal(perfis[perfil].gastoMensal);
    setRetornoNominalAA(perfis[perfil].retornoNominalAA);
    setInflacaoAA(perfis[perfil].inflacaoAA);
  }, [perfil]);

  const anosAteApos = useMemo(()=> Math.max(0, idadeApos - idadeAtual), [idadeApos, idadeAtual])
  const aporteMensal = useMemo(()=> Math.round(rendaMensal * (percInvestRenda/100)), [rendaMensal, percInvestRenda])

  // rentabilidade REAL = retorno esperado – inflação
  const rentRealAA = useMemo(()=> (retornoNominalAA - inflacaoAA)/100, [retornoNominalAA, inflacaoAA])
  const iMensal = useMemo(()=> Math.pow(1 + rentRealAA, 1/12) - 1, [rentRealAA])

  // Projeção até a aposentadoria (FV em R$ de hoje)
  const saldoNaAposentadoria = useMemo(()=>{
    const n = anosAteApos * 12
    let saldo = investido
    for (let m=0; m<n; m++) {
      saldo = saldo * (1 + iMensal) + aporteMensal
    }
    return Math.max(0, saldo)
  }, [investido, anosAteApos, iMensal, aporteMensal])

  // Saque pós-aposentadoria: método FIRE 4% OU gasto mensal desejado
  const saqueMensalFixo = useMemo(()=>{
    if (metodoSaque === "gasto") return Math.max(0, gastoMensal)
    const saqueAnual = saldoNaAposentadoria * TAXA_RETIRADA
    return Math.max(0, saqueAnual / 12)
  }, [metodoSaque, gastoMensal, saldoNaAposentadoria])

  // Patrimônio necessário (para comparação): alvo informado OU FIRE baseado no gasto
  const necessario = useMemo(()=>{
    const base = alvoPatrimonio > 0 ? alvoPatrimonio : (gastoMensal * 12) / TAXA_RETIRADA
    return Math.max(0, base)
  }, [alvoPatrimonio, gastoMensal])

  const podeGastarMes = useMemo(()=>{
    // exibição informativa: se for FIRE4, mostra 4%/12; se for “gasto”, mostra o próprio gasto
    return metodoSaque === "gasto" ? gastoMensal : (saldoNaAposentadoria * TAXA_RETIRADA) / 12
  }, [metodoSaque, gastoMensal, saldoNaAposentadoria])

  const diff = saldoNaAposentadoria - necessario
  const atingiu = diff >= 0

  // >>> Série por idade, com 2 fases até idadeVida (sem “puxar” valor do input)
  const chartData = useMemo(()=>{
    const idadeFim = clamp(idadeVida, idadeAtual, 120)
    const pontos: { idade: number; saldo: number }[] = []

    // Fase 1 — acumulação até min(idadeApos, idadeFim)
    let s = investido
    pontos.push({ idade: idadeAtual, saldo: Math.max(0, s) })

    const ultimoAcum = Math.min(idadeApos, idadeFim)
    for (let ano = idadeAtual + 1; ano <= ultimoAcum; ano++) {
      for (let m = 0; m < 12; m++) {
        s = s * (1 + iMensal) + aporteMensal
      }
      pontos.push({ idade: ano, saldo: Math.max(0, s) })
    }

    // Fase 2 — pós-aposentadoria até idadeVida (se houver)
    if (idadeFim > idadeApos) {
      let sPos = s
      for (let ano = idadeApos + 1; ano <= idadeFim; ano++) {
        for (let m = 0; m < 12; m++) {
          sPos = sPos * (1 + iMensal) - saqueMensalFixo
          if (sPos <= 0) { sPos = 0; break }
        }
        pontos.push({ idade: ano, saldo: Math.max(0, sPos) })
        if (sPos <= 0) break
      }
    }

    return pontos
  }, [investido, idadeAtual, idadeApos, idadeVida, iMensal, aporteMensal, saqueMensalFixo])

  // Ações
  const limpar = () => {
    setRendaMensal(15000)
    setInvestido(150000)
    setAlvoPatrimonio(1000000)
    setPercInvestRenda(5)
    setIdadeAtual(37)
    setIdadeApos(65)
    setIdadeVida(95)
    setGastoMensal(5000)
    setRetornoNominalAA(10)
    setInflacaoAA(5)
    setMetodoSaque("fire4")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const imprimir = () => window.print()
  const bumpReal = (deltaPP: number) =>
    setRetornoNominalAA(clamp(retornoNominalAA + deltaPP, -50, 100))

  return (
  <div className="mx-auto max-w-4xl px-6 py-10 bg-white min-h-screen rounded-3xl shadow-xl text-[15px]">
  <header className="mb-8 print:hidden text-[15px]">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-light tracking-tight text-neutral-900">
            Cálculo de Liberdade Financeira
          </h1>
          <div className="ml-auto flex gap-2">
            <button
              onClick={imprimir}
              className="rounded-full bg-black/90 px-5 py-2 text-white font-medium shadow-sm hover:bg-black transition"
            >
              Imprimir
            </button>
            <button
              onClick={limpar}
              className="rounded-full bg-neutral-100 px-5 py-2 text-neutral-700 font-medium shadow-sm hover:bg-neutral-200 transition"
            >
              Limpar
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-neutral-500">Perfil:</span>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium border transition ${perfil==='jovem' ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'}`}
            onClick={()=>setPerfil('jovem')}
          >Jovem</button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium border transition ${perfil==='adulto' ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'}`}
            onClick={()=>setPerfil('adulto')}
          >Adulto</button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium border transition ${perfil==='terceiraIdade' ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'}`}
            onClick={()=>setPerfil('terceiraIdade')}
          >Terceira Idade</button>
        </div>
        <p className="mt-2 text-sm text-neutral-500 whitespace-nowrap">
          Valores em <strong>R$ de hoje</strong>. Rentabilidade real usada = <strong>{retornoNominalAA}% − {inflacaoAA}% = {(rentRealAA*100).toFixed(1)}% a.a.</strong> <span className="mx-2">·</span>Regra FIRE: <strong>4,0% a.a.</strong> ou “gasto mensal desejado”.
        </p>
      </header>

      {/* Formulário */}
  <section className="grid gap-4 md:grid-cols-2 text-[15px]">
        <MoneyInput id="renda" label="Quanto você ganha por mês?" value={rendaMensal} onChange={setRendaMensal}/>
        <MoneyInput id="inv" label="Quanto você já tem investido?" value={investido} onChange={setInvestido}/>
        <MoneyInput id="alvo" label="Com quanto de patrimônio quer se aposentar? (opcional)" value={alvoPatrimonio} onChange={setAlvoPatrimonio}/>
        <PercentInput id="perc" label="Quantos % da renda você investe?" value={percInvestRenda} onChange={(v)=>setPercInvestRenda(clamp(v,0,100))}/>
        <NumberInput id="idade" label="Qual sua idade atual" value={idadeAtual} onChange={(v)=>setIdadeAtual(clamp(v,0,120))}/>
        <NumberInput id="apos" label="Com quantos anos deseja se aposentar?" value={idadeApos} onChange={(v)=>setIdadeApos(clamp(v,0,120))}/>
        <LifeAgeInput id="vida" label="Até que idade pretende viver?" value={idadeVida} onCommit={(v)=>setIdadeVida(v)} min={idadeAtual} max={120}/>
        <PercentInput id="ret" label="Retorno esperado (a.a.)" value={retornoNominalAA} onChange={(v)=>setRetornoNominalAA(clamp(v,-50,100))}/>
        <PercentInput id="inf" label="Inflação esperada (a.a.)" value={inflacaoAA} onChange={(v)=>setInflacaoAA(clamp(v,-10,50))}/>
        <MoneyInput id="gasto" label="Quanto pretende gastar por mês aposentado?" value={gastoMensal} onChange={setGastoMensal}/>
      </section>

      {/* Toggle de método de saque */}
  <section className="mt-6 text-[15px]">
        <div className="inline-flex rounded-full bg-neutral-100 p-1 shadow-sm">
          <button
            className={`px-4 py-1.5 text-base font-medium rounded-full transition ${metodoSaque==='fire4' ? 'bg-black text-white shadow' : 'text-neutral-700 hover:bg-neutral-200'}`}
            onClick={()=>setMetodoSaque('fire4')}
          >
            Saque 4% a.a. (FIRE)
          </button>
          <button
            className={`ml-1 px-4 py-1.5 text-base font-medium rounded-full transition ${metodoSaque==='gasto' ? 'bg-black text-white shadow' : 'text-neutral-700 hover:bg-neutral-200'}`}
            onClick={()=>setMetodoSaque('gasto')}
          >
            Gasto mensal desejado
          </button>
        </div>
        <p className="mt-2 text-sm text-neutral-400">
          O método selecionado vale apenas para a fase pós-aposentadoria.
        </p>
      </section>

      {/* Resultado (cards) */}
  <section className="mt-8 text-[15px]">
        <div className={`rounded-2xl px-6 py-4 shadow-md ${atingiu ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
          <span className="text-base font-medium">
            {atingiu
              ? <>Parabéns! Você já atinge a meta com os investimentos atuais.</>
              : <>Ainda não atinge a meta: ajuste aportes, retorno ou prazo para chegar lá.</>}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3 text-[15px]">
          <div className="rounded-2xl bg-neutral-50 p-4 shadow-sm">
            <div className="text-xs text-neutral-500 whitespace-nowrap">Aporte estimado por mês</div>
            <div className="mt-2 text-base font-semibold text-neutral-900 whitespace-nowrap">{fmtBRL(aporteMensal)}</div>
            <div className="text-xs text-neutral-400 whitespace-nowrap">(R$ {rendaMensal.toLocaleString("pt-BR")} × {percInvestRenda}%)</div>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-4 shadow-sm">
            <div className="text-xs text-neutral-500 whitespace-nowrap">Patrimônio ao aposentar</div>
            <div className="mt-2 text-base font-semibold text-neutral-900 whitespace-nowrap">{fmtBRL(Math.round(saldoNaAposentadoria))}</div>
            <div className="text-xs text-neutral-400 whitespace-nowrap">{anosAteApos} anos de acumulação a {(rentRealAA*100).toFixed(1)}% a.a. real</div>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-4 shadow-sm">
            <div className="text-xs text-neutral-500 whitespace-nowrap">
              Poderá gastar por mês ({metodoSaque === "gasto" ? "gasto desejado" : "regra 4%"})
            </div>
            <div className="mt-2 text-base font-semibold text-neutral-900 whitespace-nowrap">{fmtBRL(Math.round(podeGastarMes))}</div>
            <div className="text-xs text-neutral-400 whitespace-nowrap">
              {metodoSaque === "gasto"
                ? "Saque real fixo igual ao gasto desejado"
                : "Saque real fixo de 4% a.a. do patrimônio"}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm border border-neutral-100 text-[15px]">
          <div className="text-xs text-neutral-500 whitespace-nowrap">
            Meta considerada: {alvoPatrimonio > 0 ? "alvo informado" : "FIRE (gasto × 12 ÷ 4%)"}
          </div>
          <div className={`text-sm font-semibold whitespace-nowrap ${atingiu ? "text-emerald-700" : "text-amber-700"}`}>
            {atingiu ? `Você passou da meta em ${fmtBRL(diff)}.` : `Faltam ${fmtBRL(-diff)} para atingir a meta.`}
          </div>
        </div>
      </section>

      {/* Sensibilidade + Gráfico (com declínio pós-aposentadoria até idadeVida) */}
  <section className="mt-10 text-[15px]">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-700">
            Evolução do patrimônio (R$ de hoje) — rentabilidade real: <strong>{(rentRealAA*100).toFixed(1)}% a.a.</strong> • horizonte até <strong>{idadeVida}</strong> anos
          </span>
          <div className="ml-auto flex gap-2">
            <button className="inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium text-white shadow-sm bg-black/80 hover:bg-black transition" onClick={()=>setRetornoNominalAA(Math.max(-50, retornoNominalAA - 1))}>−1% retorno</button>
            <button className="inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium text-white shadow-sm bg-black/80 hover:bg-black transition" onClick={()=>setRetornoNominalAA(Math.min(100, retornoNominalAA + 1))}>+1% retorno</button>
          </div>
        </div>

  <div className="h-80 w-full rounded-2xl bg-white p-4 shadow border border-neutral-100 text-[15px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="idade" label={{ value: "Idade", position: "insideBottomRight", offset: -4 }} />
              <YAxis tickFormatter={(v)=> fmtCompactBRL(Number(v))} width={80} />
              <Tooltip
                formatter={(val)=>[fmtBRL(Number(val)), "Saldo"]}
                labelFormatter={(l)=>`Idade: ${l} anos`}
              />
              <Line type="monotone" dataKey="saldo" stroke="#111" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

  <p className="mt-3 text-xs text-neutral-400">
          No pós-aposentadoria, o saque é real e fixo: <strong>
            {metodoSaque === "gasto" ? "igual ao gasto desejado" : "4% ao ano do patrimônio ao aposentar"}
          </strong>. Se a rentabilidade real for menor que o ritmo de saque, o patrimônio decresce ao longo do tempo.
        </p>
      </section>

      {/* Explicação FIRE (simples) */}
      <section className="mt-12 rounded-2xl bg-neutral-50 p-6 shadow-sm border border-neutral-100 text-[15px]">
        <h3 className="font-semibold mb-2 text-base text-neutral-900">O que é FIRE?</h3>
        <p className="text-xs text-neutral-500 mb-2">
          <strong>FIRE</strong> (Financial Independence, Retire Early) é um movimento global que busca a independência financeira e a possibilidade de se aposentar cedo, acumulando patrimônio suficiente para viver de renda.
        </p>
        <p className="text-xs text-neutral-500 mb-2">
          A regra prática mais conhecida é a dos <strong>4% ao ano</strong>: estima-se que, ao acumular um patrimônio capaz de sustentar saques anuais de até 4% (em valores reais), é possível manter o padrão de vida sem esgotar o capital ao longo do tempo.
        </p>
        <p className="text-xs text-neutral-500">
          Exemplo: para um gasto anual de {fmtBRL(gastoMensal*12)}, o patrimônio alvo seria ≈ {fmtBRL((gastoMensal*12)/TAXA_RETIRADA)}.
        </p>
      </section>

  <div className="mt-10 text-xs text-neutral-400 text-center print:block">
        Projeções educativas. Não constitui aconselhamento financeiro, previdenciário ou jurídico.
      </div>

      {/* Seção explicativa adicional */}
      <section className="mt-12 print:break-before-page text-[15px]">
        <h3 className="font-semibold mb-2 text-base text-neutral-900">Como funciona esta calculadora?</h3>
        <p className="text-xs text-neutral-500 mb-2">
          Esta calculadora de <strong>Liberdade Financeira</strong> utiliza o método FIRE (Financial Independence, Retire Early) para estimar o patrimônio necessário para viver de renda. Os cálculos consideram:
        </p>
        <ul className="list-disc pl-6 text-neutral-500 text-xs mb-2">
          <li>O valor que você já possui investido e os aportes mensais futuros.</li>
          <li>O retorno esperado dos investimentos, descontada a inflação (rentabilidade real).</li>
          <li>O tempo até a aposentadoria e o tempo de vida desejado.</li>
          <li>O método de saque: regra dos 4% ao ano (FIRE) ou um valor de gasto mensal desejado.</li>
        </ul>
        <p className="text-xs text-neutral-500 mb-2">
          O simulador projeta o crescimento do patrimônio até a aposentadoria e simula os saques durante a fase de usufruto, mostrando se o patrimônio é suficiente para sustentar o padrão de vida desejado.
        </p>
        <p className="text-xs text-neutral-500 mb-2">
          <strong>Importante:</strong> Os resultados são estimativas baseadas nos parâmetros informados e não constituem aconselhamento financeiro. Para simulações oficiais de aposentadoria, acesse o site do <a href="https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias" target="_blank" rel="noopener noreferrer" className="underline">Instituto Nacional de Seguridade Social (INSS)</a>.
        </p>
      </section>

      {/* Endereço do site para impressão */}
      <div className="hidden print:block mt-8 text-center text-xs text-neutral-400">
        Acesse: <a href="https://minhascalculadoras.com" className="underline text-blue-700">https://minhascalculadoras.com</a>
      </div>
    </div>
  )
}
