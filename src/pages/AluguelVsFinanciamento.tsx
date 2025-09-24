export default function AluguelVsFinanciamento() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Aluguel vs Financiamento <span className='ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-xs text-yellow-700 font-bold align-middle'>BETA</span></h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <p className="text-neutral-600 text-base mb-2">
          Compare o custo total de alugar ou financiar um imóvel ao longo do tempo. Informe valores, taxas e prazos para simular cenários.
        </p>
        <div className="text-neutral-400 italic">Funcionalidade em desenvolvimento. Resultados são apenas estimativas.</div>
      </div>
      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui aconselhamento financeiro ou imobiliário.<br/>
        Versão BETA — sujeita a ajustes.
      </div>
    </div>
  )
}