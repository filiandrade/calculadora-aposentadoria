export default function FinanciamentoImobiliario() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Financiamento Imobiliário <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <p className="text-neutral-600 text-base mb-2">
          <strong>O que é?</strong><br/>
          O financiamento imobiliário permite comprar um imóvel pagando em parcelas, com juros. Entender o custo total é essencial para tomar boas decisões.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Como funciona?</strong><br/>
          Você informa o valor do imóvel, entrada, taxa de juros e prazo. A calculadora mostrará o valor das parcelas, o total pago e o custo dos juros.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Exemplo prático:</strong><br/>
          Um imóvel de R$ 400.000 financiado em 30 anos a 9% ao ano pode gerar parcelas de R$ 3.200 e um custo total de mais de R$ 700.000.
        </p>
        <div className="text-neutral-400 italic">A calculadora estará disponível em breve. Use as informações para planejar seu financiamento!</div>
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}