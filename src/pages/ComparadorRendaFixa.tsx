import { useState } from "react"
import { Card } from "../components/ui/card"
import { InputAffix } from "../components/InputAffix"

const produtos = [
  {
    nome: "Tesouro Selic",
    tipo: "Tesouro Direto",
    liquidez: "Diária",
    rentabilidade: "Selic",
    imposto: "Sim",
    garantia: "Tesouro Nacional",
  },
  {
    nome: "CDB Bancos Grandes",
    tipo: "CDB",
    liquidez: "Diária",
    rentabilidade: "100% do CDI",
    imposto: "Sim",
    garantia: "FGC até R$ 250 mil",
  },
  {
    nome: "LCI/ LCA",
    tipo: "LCI/LCA",
    liquidez: "Após carência",
    rentabilidade: "90% a 100% do CDI",
    imposto: "Não",
    garantia: "FGC até R$ 250 mil",
  },
  {
    nome: "CRI/CRA",
    tipo: "CRI/CRA",
    liquidez: "Baixa",
    rentabilidade: "Prefixado ou IPCA+",
    imposto: "Não",
    garantia: "Sem FGC",
  },
  {
    nome: "Tesouro IPCA+",
    tipo: "Tesouro Direto",
    liquidez: "Diária",
    rentabilidade: "IPCA + juros",
    imposto: "Sim",
    garantia: "Tesouro Nacional",
  },
]

export default function ComparadorRendaFixa() {
  const [busca, setBusca] = useState("")
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900 flex items-center gap-2">
        <span className="w-6 h-6 bg-green-600 rounded-full text-white flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="14" height="8" rx="2" fill="currentColor"/><path d="M7 10h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        </span>
        Comparador de Renda Fixa
      </h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <div className="mb-4">
          <InputAffix
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar produto..."
            prefix="🔍"
            className="w-full"
          />
        </div>
        <div className="grid gap-4">
          {filtrados.length === 0 && (
            <div className="text-neutral-500 text-sm">Nenhum produto encontrado.</div>
          )}
          {filtrados.map(produto => (
            <Card key={produto.nome} className="p-4 flex flex-col gap-2 border border-neutral-100 bg-white">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 text-lg">{produto.nome}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{produto.tipo}</span>
                <span className="px-2 py-0.5 rounded-full bg-black text-white text-xs font-bold">{produto.liquidez}</span>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">{produto.rentabilidade}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${produto.imposto === "Sim" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{produto.imposto === "Sim" ? "IR" : "Isento"}</span>
              </div>
              <div className="text-sm text-neutral-500">Garantia: {produto.garantia}</div>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-6 text-xs text-neutral-400 text-center">
        <span>Compare produtos de renda fixa populares do Brasil. Nenhum dado é coletado.</span>
      </div>
    </div>
  )
}
