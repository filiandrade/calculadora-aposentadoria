export default function CltVsPj() {
  return (
  <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">CLT vs PJ <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <p className="text-neutral-600 text-base mb-2">
          <strong>O que é?</strong><br/>
          CLT e PJ são regimes de contratação com diferenças em salário, benefícios, impostos e direitos. Entender essas diferenças é fundamental para negociar e planejar sua carreira.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Como funciona?</strong><br/>
          Você poderá informar salários, benefícios e custos. A calculadora mostrará o valor líquido, encargos e comparativo entre as opções.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Exemplo prático:</strong><br/>
          Um salário de R$ 8.000 como CLT pode equivaler a R$ 10.000 como PJ, dependendo dos benefícios e impostos.
        </p>
        <div className="text-neutral-400 italic">A calculadora estará disponível em breve. Aproveite para entender as diferenças e planejar sua escolha!</div>
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento trabalhista ou fiscal.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}