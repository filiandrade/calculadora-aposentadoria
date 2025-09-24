export default function JurosCompostos() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Juros Compostos <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <p className="text-neutral-600 text-base mb-2">
          <strong>O que é?</strong><br/>
          Juros compostos são a base do crescimento exponencial dos investimentos. Ao reinvestir os rendimentos, o dinheiro "trabalha para você" e cresce cada vez mais rápido ao longo do tempo.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Como funciona?</strong><br/>
          Você informa o valor inicial, os aportes mensais, a taxa de juros anual e o prazo. A calculadora mostra quanto você terá ao final do período, quanto investiu e quanto foi ganho em juros.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Exemplo prático:</strong><br/>
          Se investir R$ 1.000,00 por mês a 10% ao ano durante 20 anos, terá investido R$ 240.000,00 e poderá acumular mais de R$ 700.000,00, graças aos juros sobre juros.
        </p>
        <div className="text-neutral-400 italic">A calculadora estará disponível em breve. Enquanto isso, aproveite para entender o conceito e planejar seus investimentos!</div>
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}