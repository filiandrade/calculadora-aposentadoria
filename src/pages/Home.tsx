import { Link } from "react-router-dom"

const calculators = [
  {
    name: "Liberdade Financeira",
    path: "/liberdade-financeira",
    description: "Quando posso me aposentar? Quanto preciso acumular?",
    beta: false,
  },
  {
    name: "Aposentadoria Oficial (INSS)",
    path: "/aposentadoria-oficial",
    description: "Simule sua aposentadoria oficial pelo INSS.",
    beta: false,
  },
  {
    name: "Juros Compostos",
    path: "/juros-compostos",
    description: "Simule o crescimento de um investimento ao longo do tempo.",
    beta: true,
  },
  {
    name: "Rentabilidade Real",
    path: "/rentabilidade-real",
    description: "Descubra o rendimento descontando a inflação.",
    beta: true,
  },
  {
    name: "Financiamento Imobiliário",
    path: "/financiamento-imobiliario",
    description: "Simule parcelas e custos de um financiamento.",
    beta: true,
  },
  {
    name: "CLT vs PJ",
    path: "/clt-vs-pj",
    description: "Compare salários e benefícios entre CLT e PJ.",
    beta: true,
  },
  {
    name: "Calculadora de INSS",
    path: "/inss",
    description: "Calcule contribuições e benefícios do INSS.",
    beta: true,
  },
  {
    name: "Aluguel vs Financiamento",
    path: "/aluguel-vs-financiamento",
    description: "Compare o custo de alugar ou financiar um imóvel.",
    beta: true,
  },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-[15px]">
      <div className="mb-8 rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-500 text-center">
        <strong>Aviso:</strong> Nenhum dado é coletado ou armazenado. Todas as simulações são feitas localmente no seu navegador. Para informações oficiais, consulte sempre os sites dos órgãos competentes.
      </div>

      {/* Seção Calculadoras */}
      <h2 className="text-xl font-semibold mb-4 text-neutral-900">Calculadoras</h2>
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {calculators.map(calc => (
          <div key={calc.path} className="rounded-2xl bg-white shadow p-6 flex flex-col gap-2 border border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-neutral-800">{calc.name}</span>
              {calc.beta && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold">BETA</span>
              )}
            </div>
            <div className="text-sm text-neutral-500 mb-2">{calc.description}</div>
            <Link to={calc.path} className="inline-block mt-auto rounded-full bg-black/90 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-black transition">Acessar</Link>
          </div>
        ))}
      </div>

      {/* Seção Comparadores */}
      <h2 className="text-xl font-semibold mb-4 text-neutral-900">Comparadores</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white shadow p-6 flex flex-col gap-2 border border-neutral-100 opacity-60">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-neutral-800">Comparador de Cartões de Crédito</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-xs text-blue-700 font-bold">Em breve</span>
          </div>
          <div className="text-sm text-neutral-500 mb-2">Compare taxas, benefícios e custos dos principais cartões do mercado.</div>
          <button disabled className="inline-block mt-auto rounded-full bg-neutral-200 px-4 py-2 text-neutral-500 text-sm font-medium shadow-sm cursor-not-allowed">Acessar</button>
        </div>
        <div className="rounded-2xl bg-white shadow p-6 flex flex-col gap-2 border border-neutral-100 opacity-60">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-neutral-800">Comparador de Renda Fixa</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-xs text-green-700 font-bold">Em breve</span>
          </div>
          <div className="text-sm text-neutral-500 mb-2">Compare CDB, Tesouro, LCIs, LCAs e outros investimentos de renda fixa.</div>
          <button disabled className="inline-block mt-auto rounded-full bg-neutral-200 px-4 py-2 text-neutral-500 text-sm font-medium shadow-sm cursor-not-allowed">Acessar</button>
        </div>
      </div>

      <div className="mt-10 text-xs text-neutral-400 text-center flex flex-col gap-2">
        <span>Simule, compare e planeje seu futuro financeiro. Nenhum dado é coletado.</span>
      </div>
    </div>
  )
}
