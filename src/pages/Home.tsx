import { Link } from "react-router-dom"

const calculators = [
  {
    name: "Aposentadoria",
    path: "/aposentadoria",
    description: "Quando posso me aposentar? Quanto preciso acumular?",
    available: true,
  },
  {
    name: "Juros Compostos",
    path: "/juros-compostos",
    description: "Simule o crescimento de um investimento ao longo do tempo.",
    available: false,
  },
  {
    name: "Rentabilidade Real",
    path: "/rentabilidade-real",
    description: "Descubra o rendimento descontando a inflação.",
    available: false,
  },
  {
    name: "Financiamento Imobiliário",
    path: "/financiamento-imobiliario",
    description: "Simule parcelas e custos de um financiamento.",
    available: false,
  },
  {
    name: "CLT vs PJ",
    path: "/clt-vs-pj",
    description: "Compare salários e benefícios entre CLT e PJ.",
    available: false,
  },
  {
    name: "Calculadora de INSS",
    path: "/inss",
    description: "Calcule contribuições e benefícios do INSS.",
    available: false,
  },
  {
    name: "Aluguel vs Financiamento",
    path: "/aluguel-vs-financiamento",
    description: "Compare o custo de alugar ou financiar um imóvel.",
    available: false,
  },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-light mb-8 text-neutral-900">Minhas Calculadoras</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {calculators.map(calc => (
          <div key={calc.path} className="rounded-2xl bg-white shadow p-6 flex flex-col gap-2 border border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-neutral-800">{calc.name}</span>
              {!calc.available && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-neutral-200 text-xs text-neutral-500">em breve</span>
              )}
            </div>
            <div className="text-sm text-neutral-500 mb-2">{calc.description}</div>
            {calc.available ? (
              <Link to={calc.path} className="inline-block mt-auto rounded-full bg-black/90 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-black transition">Acessar</Link>
            ) : (
              <button className="inline-block mt-auto rounded-full bg-neutral-100 px-4 py-2 text-neutral-400 text-sm font-medium cursor-not-allowed" disabled>Em breve</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
