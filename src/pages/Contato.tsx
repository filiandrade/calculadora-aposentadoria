export default function Contato() {
  return (
  <div className="mx-auto max-w-2xl px-4 py-10 text-[15px]">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Contato</h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <p className="text-neutral-600 text-base mb-2">
          Tem dúvidas, sugestões ou encontrou algum problema? Entre em contato!
        </p>
        <ul className="text-sm text-neutral-700 mb-2 list-disc pl-5">
          <li>Envie um e-mail para <a href="mailto:contato@minhascalculadoras.com" className="underline">contato@minhascalculadoras.com</a></li>
        </ul>
        <form className="grid gap-4 mt-4" onSubmit={e => {e.preventDefault(); alert('Mensagem enviada!');}}>
          <label className="grid gap-1">
            <span className="text-xs font-medium">Nome</span>
            <input type="text" name="nome" required className="w-full rounded-md border bg-white px-3 py-2 text-[15px]" />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-medium">E-mail</span>
            <input type="email" name="email" required className="w-full rounded-md border bg-white px-3 py-2 text-[15px]" />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-medium">Mensagem</span>
            <textarea name="mensagem" required rows={4} className="w-full rounded-md border bg-white px-3 py-2 text-[15px]" />
          </label>
          <button type="submit" className="rounded-full bg-black/90 px-5 py-2 text-white font-medium shadow-sm hover:bg-black transition text-xs">Enviar</button>
        </form>
        <div className="text-xs text-neutral-400 mt-2">Responderemos o mais breve possível.</div>
      </div>
    </div>
  )
}
