export default function AposentadoriaOficial() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Aposentadoria Oficial (INSS)</h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <p className="text-neutral-600 text-base mb-2">
          Simule sua aposentadoria oficial pelo INSS. Informe seus dados e veja uma estimativa de quando poderá se aposentar e qual o valor do benefício, de acordo com as regras atuais.
        </p>
        <div className="text-xs text-neutral-400 mb-2">
          <strong>Atenção:</strong> Esta calculadora é apenas uma estimativa simplificada. Para informações oficiais, consulte o <a href="https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias" className="underline" target="_blank" rel="noopener noreferrer">site do INSS</a>.
        </div>
        <div className="text-neutral-400 italic">(Em breve)</div>
      </div>
    </div>
  )
}
