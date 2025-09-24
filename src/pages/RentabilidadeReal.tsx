export default function RentabilidadeReal() {
  return (
  <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Rentabilidade Real <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <p className="text-neutral-600 text-base mb-2">
          <strong>O que é?</strong><br/>
          Rentabilidade real é o quanto seu dinheiro realmente cresce, descontando o efeito da inflação. Um investimento que rende 10% ao ano, mas com inflação de 6%, tem ganho real de apenas 3,77%.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Como funciona?</strong><br/>
          Você informa o rendimento bruto e a inflação do período. A calculadora mostra o ganho real, ou seja, quanto seu poder de compra aumentou de fato.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Exemplo prático:</strong><br/>
          Se um investimento rendeu 8% no ano e a inflação foi de 4%, o ganho real foi de aproximadamente 3,85%.
        </p>
        <div className="text-neutral-400 italic">A calculadora estará disponível em breve. Aproveite para entender o conceito e comparar investimentos!</div>
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}