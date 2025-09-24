export default function AluguelVsFinanciamento() {
  return (
  <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Aluguel vs Financiamento <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <p className="text-neutral-600 text-base mb-2">
          <strong>O que é?</strong><br/>
          Alugar ou financiar um imóvel é uma das principais decisões financeiras. Cada opção tem vantagens e custos diferentes ao longo do tempo.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Como funciona?</strong><br/>
          Você poderá informar valores de aluguel, imóvel, entrada, taxas e prazos. A calculadora mostrará o custo total de cada opção e o saldo acumulado ao longo dos anos.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Exemplo prático:</strong><br/>
          Alugar um imóvel de R$ 2.000 por mês pode ser mais vantajoso do que financiar, dependendo do valor do imóvel, taxa de juros e tempo de permanência.
        </p>
        <div className="text-neutral-400 italic">A calculadora estará disponível em breve. Use as informações para tomar decisões mais conscientes!</div>
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro ou imobiliário.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}