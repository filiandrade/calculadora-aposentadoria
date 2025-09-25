import { useState } from "react"
import { Card } from "../components/ui/card"
import { InputAffix } from "../components/InputAffix"

const cartoes = [
  {
    nome: "Nubank",
    anuidade: 0,
    cashback: "Não",
    internacional: true,
    beneficios: "Mastercard Surpreenda, app completo",
  },
  {
    nome: "C6 Bank",
    anuidade: 0,
    cashback: "Sim",
    internacional: true,
    beneficios: "Programa Átomos, tag de pedágio grátis",
  },
  {
    nome: "Inter",
    anuidade: 0,
    cashback: "Sim",
    internacional: true,
    beneficios: "Cashback, app completo, sem tarifas",
  },
  {
    nome: "XP",
    anuidade: 0,
    cashback: "Sim",
    internacional: true,
    beneficios: "Investimentos, cashback, Visa Infinite",
  },
  {
    nome: "Bradesco Elo Nanquim",
    anuidade: 996,
    cashback: "Não",
    internacional: true,
    beneficios: "Salas VIP, pontos Livelo, Elo Nanquim",
  },
]

export default function ComparadorCartoes() {
  const [busca, setBusca] = useState("")
  const filtrados = cartoes.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900 flex items-center gap-2">
  <span className="w-6 h-6 bg-black rounded-full text-white flex items-center justify-center font-bold text-lg">Σ</span>
        Comparador de Cartões de Crédito
      </h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <div className="mb-4">
          <InputAffix
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar cartão..."
            prefix="🔍"
            className="w-full"
          />
        </div>
        <div className="grid gap-4">
          {filtrados.length === 0 && (
            <div className="text-neutral-500 text-sm">Nenhum cartão encontrado.</div>
          )}
          {filtrados.map(cartao => (
            <Card key={cartao.nome} className="p-4 flex flex-col gap-2 border border-neutral-100 bg-white">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 text-lg">{cartao.nome}</span>
                {cartao.anuidade === 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">Sem anuidade</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">Anuidade: R$ {cartao.anuidade}</span>
                )}
                {cartao.cashback === "Sim" && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Cashback</span>
                )}
                {cartao.internacional && (
                  <span className="px-2 py-0.5 rounded-full bg-black text-white text-xs font-bold">Internacional</span>
                )}
              </div>
              <div className="text-sm text-neutral-500">{cartao.beneficios}</div>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-6 text-xs text-neutral-400 text-center">
        <span>Compare cartões de crédito populares do Brasil. Nenhum dado é coletado.</span>
      </div>
    </div>
  )
}
