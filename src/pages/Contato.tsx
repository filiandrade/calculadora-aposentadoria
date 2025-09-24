export default function Contato() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Contato</h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <p className="text-neutral-600 text-base mb-2">
          Tem dúvidas, sugestões ou encontrou algum problema? Entre em contato!
        </p>
        <ul className="text-sm text-neutral-700 mb-2 list-disc pl-5">
          <li>Envie um e-mail para <a href="mailto:contato@minhascalculadoras.com" className="underline">contato@minhascalculadoras.com</a></li>
          <li>Ou preencha o formulário abaixo (em breve)</li>
        </ul>
        <div className="text-xs text-neutral-400 mt-2">Responderemos o mais breve possível.</div>
      </div>
    </div>
  )
}
