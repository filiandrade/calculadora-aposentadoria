import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Printer, Info, Minus, Plus } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import { InputAffix } from "@/components/InputAffix"
import { parseBRInt, formatBRInt } from "@/lib/number"

// ===== Config =====
const TAXA_RETIRADA_REAL = 0.04 // “regra dos 4%” (FIRE)

// ===== Helpers =====
const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })

const toPctStr = (x: number) => String(Math.round(x * 100))
const fromPctStr = (s: string) => (parseInt(s.replace(/[^\d]/g, "") || "0", 10) / 100)

function formatCompactBR(n: number) {
  const a = Math.abs(n)
  if (a >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} bi`
  if (a >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mi`
  if (a >= 1_000) return `${Math.round(n / 1000)} mil`
  return `${Math.round(n)}`
}

const necessarioFIRE = (gastoMensal: number) => (gastoMensal * 12) / TAXA_RETIRADA_REAL

// ===== Tipos =====
type Estado = {
  rendaMensal: number
  pctInvest: number // fração
  aporteMensal: number // calculado mas pode ser editado
  patrimonioAtual: number
  alvoPatrimonio: number // “com quanto quer se aposentar” (0 = usar FIRE)
  idadeAtual: number
  idadeAposentadoria: number
  expectativaVida: number

  retornoEsperadoAA: number // FRAÇÃO a.a. (nominal, fácil pro usuário)
  inflacaoAA: number        // FRAÇÃO a.a.
  // retornoRealAA = retornoEsperadoAA - inflacaoAA (derivado)

  gastoMensalApos: number // R$ de hoje
}

function Field({ id, label, children }: { id?: string; label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="whitespace-nowrap text-sm font-medium leading-none">
        {label}
      </Label>
      {children}
    </div>
  )
}

// ===== Núcleo do cálculo =====
function simular({
  rendaMensal,
  pctInvest,
  aporteMensal,
  patrimonioAtual,
  idadeAtual,
  idadeAposentadoria,
  expectativaVida,
  retornoEsperadoAA,
  inflacaoAA,
  gastoMensalApos,
}: Estado) {
  const retornoRealAA = Math.max(-0.99, retornoEsperadoAA - inflacaoAA) // real

  // aporte padrão = renda * %
  const aporte = Math.max(0, aporteMensal || Math.round(rendaMensal * pctInvest))

  const anosAteApos = Math.max(0, idadeAposentadoria - idadeAtual)
  const anosAposentado = Math.max(0, expectativaVida - idadeAposentadoria)
  const mesesAccum = anosAteApos * 12
  const mesesRet = anosAposentado * 12

  const r = Math.pow(1 + retornoRealAA, 1 / 12) - 1 // retorno real mensal

  // FV com aportes no fim do mês
  const fator = Math.pow(1 + r, mesesAccum)
  const saldoApos =
    patrimonioAtual * fator +
    (mesesAccum > 0 ? (aporte * (fator - 1)) / (r || 1) : patrimonioAtual)

  // série anual para gráfico
  const serie: { ano: number; saldo: number }[] = []
  {
    let tmp = patrimonioAtual
    let proximo = 12
    let ano = 0
    for (let m = 1; m <= mesesAccum; m++) {
      tmp *= 1 + r
      tmp += aporte
      if (m === proximo) {
        ano++
        serie.push({ ano: idadeAtual + ano, saldo: Math.max(0, tmp) })
        proximo += 12
      }
    }
    // fase de aposentadoria (para exibir trajetória)
    let tmp2 = saldoApos
    proximo = 12
    for (let m = 1; m <= mesesRet; m++) {
      tmp2 -= gastoMensalApos
      if (tmp2 < 0) tmp2 = 0
      tmp2 *= 1 + r
      if (m === proximo) {
        ano++
        serie.push({ ano: idadeAtual + ano, saldo: Math.max(0, tmp2) })
        proximo += 12
      }
    }
  }

  return { retornoRealAA, aporte, saldoApos, serie }
}

export default function App() {
  const [S, setS] = useState<Estado>({
    rendaMensal: 15000,
    pctInvest: 0.05,
    aporteMensal: 0, // 0 = derive de renda * %
    patrimonioAtual: 150000,
    alvoPatrimonio: 1000000,
    idadeAtual: 37,
    idadeAposentadoria: 65,
    expectativaVida: 90,

    retornoEsperadoAA: 0.10, // 10% a.a. esperado
    inflacaoAA: 0.05,        // 5% a.a. inflação

    gastoMensalApos: 5000,
  })

  const R = useMemo(() => simular(S), [S])

  const saldoMeta = S.alvoPatrimonio > 0 ? S.alvoPatrimonio : necessarioFIRE(S.gastoMensalApos)
  const passouMeta = R.saldoApos >= saldoMeta
  const poderGastar = (R.saldoApos * TAXA_RETIRADA_REAL) / 12

  // Handlers para ±1 pp na rentabilidade REAL (ajusta retorno esperado mantendo inflação)
  const bumpReal = (deltaPP: number) => {
    const novoReal = R.retornoRealAA + deltaPP / 100
    const novoEsperado = Math.max(-0.99, novoReal + S.inflacaoAA)
    setS({ ...S, retornoEsperadoAA: novoEsperado })
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b print:hidden">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
          <h1 className="text-2xl font-bold">Simulador de Aposentadoria</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" onClick={() => window.location.reload()}>Limpar</Button>
            <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Entradas */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Quanto você ganha por mês?">
                <InputAffix
                  prefix="R$"
                  value={formatBRInt(S.rendaMensal)}
                  onChange={(e)=>setS({...S, rendaMensal: parseBRInt(e.target.value)})}
                />
              </Field>

              <Field label="Quanto você já tem investido?">
                <InputAffix
                  prefix="R$"
                  value={formatBRInt(S.patrimonioAtual)}
                  onChange={(e)=>setS({...S, patrimonioAtual: parseBRInt(e.target.value)})}
                />
              </Field>

              <Field label="Com quanto de patrimônio você quer se aposentar? (opcional)">
                <InputAffix
                  prefix="R$"
                  value={formatBRInt(S.alvoPatrimonio)}
                  onChange={(e)=>setS({...S, alvoPatrimonio: parseBRInt(e.target.value)})}
                />
              </Field>

              <Field label="Quantos % da sua renda você investe?">
                <InputAffix
                  suffix="%"
                  inputMode="numeric"
                  value={toPctStr(S.pctInvest)}
                  onChange={(e)=>setS({...S, pctInvest: fromPctStr(e.target.value)})}
                />
              </Field>

              <Field label="Qual sua idade atual">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={S.idadeAtual}
                  onChange={(e)=>setS({...S, idadeAtual: parseInt(e.target.value||"0",10)})}
                />
              </Field>

              <Field label="Com quantos anos você deseja se aposentar?">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={S.idadeAposentadoria}
                  onChange={(e)=>setS({...S, idadeAposentadoria: parseInt(e.target.value||"0",10)})}
                />
              </Field>

              <Field label="Retorno esperado (a.a.)">
                <InputAffix
                  suffix="%"
                  inputMode="numeric"
                  value={toPctStr(S.retornoEsperadoAA)}
                  onChange={(e)=>setS({...S, retornoEsperadoAA: fromPctStr(e.target.value)})}
                />
              </Field>

              <Field label="Inflação esperada (a.a.)">
                <InputAffix
                  suffix="%"
                  inputMode="numeric"
                  value={toPctStr(S.inflacaoAA)}
                  onChange={(e)=>setS({...S, inflacaoAA: fromPctStr(e.target.value)})}
                />
              </Field>

              <Field label="Quanto você pretende gastar por mês aposentado?">
                <InputAffix
                  prefix="R$"
                  value={formatBRInt(S.gastoMensalApos)}
                  onChange={(e)=>setS({...S, gastoMensalApos: parseBRInt(e.target.value)})}
                />
              </Field>
            </div>

            {/* Nota */}
            <div className="text-xs text-muted-foreground flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5" />
              <span>
                Os valores são em <b>R$ de hoje</b>. A <b>rentabilidade real</b> usada nos cálculos é
                <b> retorno esperado − inflação</b>. Regra FIRE (retirada): <b>{(TAXA_RETIRADA_REAL * 100).toFixed(1)}% a.a.</b>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Resultado</h2>

            <div className={`p-3 rounded-md text-sm ${passouMeta ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
              {passouMeta
                ? <>Parabéns! Você já atinge sua meta com os investimentos atuais.</>
                : <>Ainda não atingiu a meta: aumente aportes, adie a aposentadoria ou ajuste a meta.</>}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Card className="border border-slate-200">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Aporte estimado por mês</div>
                  <div className="text-xl font-semibold">{fmt(R.aporte)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ({fmt(S.rendaMensal)} × {(S.pctInvest*100).toFixed(0)}%)
                  </div>
                </CardContent>
              </Card>

              <Card className={`${passouMeta ? "border-green-300" : "border-amber-300"} border`}>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Você se aposentará com</div>
                  <div className="text-xl font-semibold">{fmt(R.saldoApos)}</div>
                </CardContent>
              </Card>

              <Card className="border border-blue-300">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Poderá gastar por mês (regra 4%)</div>
                  <div className="text-xl font-semibold">{fmt(poderGastar)}</div>
                </CardContent>
              </Card>
            </div>

            <Card className={`border ${passouMeta ? "border-green-400" : "border-amber-400"}`}>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  Meta considerada: {S.alvoPatrimonio > 0 ? "alvo informado" : "FIRE (gasto × 12 ÷ 4%)"}
                </div>
                <div className={`text-lg font-semibold ${passouMeta ? "text-green-700" : "text-amber-700"}`}>
                  {passouMeta
                    ? `Você passou da meta em ${fmt(R.saldoApos - saldoMeta)}.`
                    : `Faltam ${fmt(saldoMeta - R.saldoApos)} para atingir a meta.`}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Gráfico + controles de sensibilidade */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                Evolução do patrimônio (R$ de hoje) — Rentabilidade real atual: {( (S.retornoEsperadoAA - S.inflacaoAA) *100).toFixed(1)}% a.a.
              </div>
              <div className="flex items-center gap-2">
                {/* Botões mais “vivos” */}
                <Button
                  size="sm"
                  className="bg-[#165788] hover:bg-[#134a73] text-white shadow"
                  onClick={() => bumpReal(-1)}
                >
                  <Minus className="h-4 w-4 mr-2"/> Diminuir 1%
                </Button>
                <Button
                  size="sm"
                  className="bg-[#2b89cc] hover:bg-[#1f6fa3] text-white shadow"
                  onClick={() => bumpReal(1)}
                >
                  <Plus className="h-4 w-4 mr-2"/> Aumentar 1%
                </Button>
              </div>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={R.serie}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="ano"/>
                  <YAxis tickFormatter={(v)=>formatCompactBR(Number(v))}/>
                  <Tooltip formatter={(v:any)=>fmt(Number(v))}/>
                  <Legend/>
                  <Line type="monotone" dataKey="saldo" name="Patrimônio" dot={false} strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Informação do INSS */}
        <Card className="print:hidden">
          <CardContent className="p-4 text-sm text-muted-foreground space-y-2">
            <p>
              Regras oficiais do INSS:&nbsp;
              <a className="underline text-primary" href="https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias" target="_blank" rel="noreferrer">
                gov.br/inss/pt-br/direitos-e-deveres/aposentadorias
              </a>
            </p>
          </CardContent>
        </Card>

        {/* FIRE — explicação simples */}
        <Card>
          <CardContent className="p-4 text-sm">
            <div className="font-semibold mb-1">O que é FIRE?</div>
            <p>
              <b>FIRE</b> significa <i>Financial Independence, Retire Early</i> — <b>Independência Financeira</b>.
              A ideia é juntar um patrimônio suficiente para viver de renda. Uma regra prática muito usada é a
              <b> “regra dos 4%”</b>: se você consegue retirar cerca de 4% ao ano do seu patrimônio (em valores de
              hoje) para pagar seus gastos, provavelmente ele se mantém por bastante tempo sem se esgotar.
            </p>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground print:block flex items-center justify-between">
          <span>Projeções educativas. Não constitui aconselhamento financeiro, previdenciário ou jurídico.</span>
          <span>v1.0 beta</span>
        </div>
      </main>
    </div>
  )
}
import SiteFooter from "@/components/SiteFooter";


