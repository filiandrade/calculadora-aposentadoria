export default function Inss() {
  return (
  <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Calculadora de INSS <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <p className="text-neutral-600 text-base mb-2">
          <strong>O que é?</strong><br/>
          O INSS é responsável pela previdência dos trabalhadores no Brasil. Contribuir corretamente garante acesso a benefícios como aposentadoria, auxílio-doença e salário-maternidade.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Como funciona?</strong><br/>
          Você poderá informar sua renda e categoria (CLT, MEI, autônomo). A calculadora mostrará quanto deve contribuir e estimativas de benefícios.
        </p>
        <p className="text-neutral-600 text-base mb-2">
          <strong>Exemplo prático:</strong><br/>
          Um trabalhador CLT com salário de R$ 3.000 contribui com cerca de R$ 330 por mês e pode se aposentar com benefício proporcional ao tempo e valor das contribuições.
        </p>
        <div className="text-neutral-400 italic">A calculadora estará disponível em breve. Use as informações para planejar sua previdência!</div>
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui cálculo oficial nem aconselhamento previdenciário.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}