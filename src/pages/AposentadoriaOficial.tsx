import { useState } from "react"

type Sexo = "masculino" | "feminino"

function anosMesesParaMeses(anos: number, meses: number) {
  return anos * 12 + meses
}

function mesesParaAnosMeses(meses: number) {
  const a = Math.floor(meses / 12)
  const m = meses % 12
  return { anos: a, meses: m }
}

const hoje = new Date()
const anoAtual = hoje.getFullYear()
const mesAtual = hoje.getMonth() + 1
const diaAtual = hoje.getDate()

export default function AposentadoriaOficial() {
  // Inputs
  const [sexo, setSexo] = useState<Sexo>("masculino")
  const [dataNasc, setDataNasc] = useState("")
  const [anosContrib, setAnosContrib] = useState(0)
  const [mesesContrib, setMesesContrib] = useState(0)
  const [salarioMedio, setSalarioMedio] = useState(0)
  const [contribuiuAntes2019, setContribuiuAntes2019] = useState(false)

  // Cálculos auxiliares
  let idade = 0
  if (dataNasc) {
    const [ano, mes, dia] = dataNasc.split("-").map(Number)
    idade = ano ? anoAtual - ano - (mesAtual < mes || (mesAtual === mes && diaAtual < dia) ? 1 : 0) : 0
  }
  const totalMesesContrib = anosMesesParaMeses(anosContrib, mesesContrib)
  const totalAnosContrib = totalMesesContrib / 12

  // Parâmetros das regras (2025)
  const regras = {
    idadeMin: sexo === "masculino" ? 65 : 62,
    tempoMin: sexo === "masculino" ? 20 : 15, // tempo mínimo de contribuição (anos)
    pontosTransicao: sexo === "masculino" ? 102 : 92, // regra de pontos 2025
    idadeTransicao: sexo === "masculino" ? 63 : 58.5, // idade mínima transição 2025
    tempoTransicao: sexo === "masculino" ? 35 : 30, // tempo mínimo transição (anos)
  }

  // Cálculos de quanto falta
  const faltaIdade = Math.max(0, regras.idadeMin - idade)
  const faltaTempo = Math.max(0, regras.tempoMin - totalAnosContrib)
  const pontos = idade + totalAnosContrib
  const faltaPontos = Math.max(0, regras.pontosTransicao - pontos)
  const faltaIdadeTrans = Math.max(0, regras.idadeTransicao - idade)
  const faltaTempoTrans = Math.max(0, regras.tempoTransicao - totalAnosContrib)

  // Estimativa de benefício (simplificada)
  let valorBeneficio = 0
  if (salarioMedio > 0) {
    valorBeneficio = salarioMedio * 0.6 + salarioMedio * 0.02 * Math.max(0, totalAnosContrib - regras.tempoMin)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-light mb-4 text-neutral-900">Aposentadoria Oficial (INSS)</h1>
      <div className="rounded-2xl bg-white shadow p-6 border border-neutral-100 mb-6">
        <div className="mb-4 text-sm text-neutral-600">
          <strong>Simule sua aposentadoria oficial pelo INSS</strong>.<br />
          <span className="text-xs text-neutral-500">Trabalhador urbano CLT. Regras válidas para 2025. Resultados são estimativas simplificadas.</span>
        </div>
        <form className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Sexo</label>
            <div className="flex gap-2 mt-1">
              <button type="button" className={`px-3 py-1 rounded-full border text-sm font-medium ${sexo==='masculino' ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-700 border-neutral-200'}`} onClick={()=>setSexo('masculino')}>Masculino</button>
              <button type="button" className={`px-3 py-1 rounded-full border text-sm font-medium ${sexo==='feminino' ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-700 border-neutral-200'}`} onClick={()=>setSexo('feminino')}>Feminino</button>
            </div>
            <div className="text-xs text-neutral-400 mt-1">A idade mínima e tempo de contribuição variam conforme o sexo.</div>
          </div>
          <div>
            <label className="text-sm font-medium">Data de nascimento</label>
            <input type="date" className="w-full rounded-md border bg-white px-3 py-2 mt-1" value={dataNasc} onChange={e=>setDataNasc(e.target.value)} />
            <div className="text-xs text-neutral-400 mt-1">Utilizada para calcular sua idade e regras de transição.</div>
          </div>
          <div>
            <label className="text-sm font-medium">Tempo total de contribuição</label>
            <div className="flex gap-2 mt-1">
              <input type="number" min={0} max={60} className="w-16 rounded-md border bg-white px-2 py-1" value={anosContrib} onChange={e=>setAnosContrib(Number(e.target.value))} placeholder="Anos" />
              <span className="self-center text-xs">anos</span>
              <input type="number" min={0} max={11} className="w-12 rounded-md border bg-white px-2 py-1" value={mesesContrib} onChange={e=>setMesesContrib(Number(e.target.value))} placeholder="Meses" />
              <span className="self-center text-xs">meses</span>
            </div>
            <div className="text-xs text-neutral-400 mt-1">Inclua todo o tempo de contribuição (CLT, autônomo, etc).</div>
          </div>
          <div>
            <label className="text-sm font-medium">Salário médio de contribuição (opcional)</label>
            <input type="number" min={0} className="w-full rounded-md border bg-white px-3 py-2 mt-1" value={salarioMedio} onChange={e=>setSalarioMedio(Number(e.target.value))} placeholder="R$" />
            <div className="text-xs text-neutral-400 mt-1">Média dos salários de contribuição desde julho/1994 (corrigidos). Usado para estimar o valor do benefício.</div>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Já contribuiu antes de 13/11/2019?</label>
            <div className="flex gap-2 mt-1">
              <button type="button" className={`px-3 py-1 rounded-full border text-sm font-medium ${contribuiuAntes2019 ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-700 border-neutral-200'}`} onClick={()=>setContribuiuAntes2019(true)}>Sim</button>
              <button type="button" className={`px-3 py-1 rounded-full border text-sm font-medium ${!contribuiuAntes2019 ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-700 border-neutral-200'}`} onClick={()=>setContribuiuAntes2019(false)}>Não</button>
            </div>
            <div className="text-xs text-neutral-400 mt-1">Se sim, pode se enquadrar em regras de transição.</div>
          </div>
        </form>
        <div className="mt-6 text-xs text-neutral-500">
          <strong>Observações:</strong><br />
          - Esta simulação é simplificada e não substitui consulta ao INSS ou a um especialista.<br />
          - Não considera aposentadoria especial, rural, professor, servidor público, etc.<br />
          - O valor do benefício é apenas uma estimativa.<br />
          - Para cálculo oficial, acesse o <a href="https://meu.inss.gov.br/" className="underline" target="_blank" rel="noopener noreferrer">Meu INSS</a>.
        </div>
      </div>

      {/* Resultados */}
      <div className="rounded-2xl bg-neutral-50 shadow p-6 border border-neutral-100 mb-6">
        <h2 className="font-semibold text-lg mb-2 text-neutral-900">Resultados</h2>
        <div className="text-sm text-neutral-700 mb-2">Idade atual: <strong>{idade || "-"}</strong> anos</div>
        <div className="text-sm text-neutral-700 mb-2">Tempo total de contribuição: <strong>{Math.floor(totalAnosContrib)} anos e {mesesParaAnosMeses(totalMesesContrib).meses} meses</strong></div>
        <div className="text-sm text-neutral-700 mb-2">Salário médio informado: <strong>{salarioMedio ? salarioMedio.toLocaleString('pt-BR', {style:'currency',currency:'BRL'}) : '-'}</strong></div>
        <div className="text-sm text-neutral-700 mb-2">Já contribuiu antes de 13/11/2019: <strong>{contribuiuAntes2019 ? 'Sim' : 'Não'}</strong></div>
        <hr className="my-4" />
        <div className="text-base font-semibold mb-2">Aposentadoria por Idade</div>
        <div className="text-sm mb-1">Idade mínima: <strong>{regras.idadeMin} anos</strong> e tempo mínimo de contribuição: <strong>{regras.tempoMin} anos</strong></div>
        <div className="text-sm mb-1">Faltam <strong>{faltaIdade.toFixed(1)}</strong> anos de idade e <strong>{faltaTempo.toFixed(1)}</strong> anos de contribuição para atingir os requisitos.</div>
        <div className="text-sm mb-2">(Atingindo ambos, pode se aposentar por idade.)</div>
        <div className="text-base font-semibold mb-2 mt-4">Aposentadoria por Tempo de Contribuição (Transição por Pontos)</div>
        <div className="text-sm mb-1">Pontos necessários: <strong>{regras.pontosTransicao}</strong> (idade + tempo de contribuição)</div>
        <div className="text-sm mb-1">Você tem: <strong>{pontos.toFixed(1)}</strong> pontos. Faltam <strong>{faltaPontos.toFixed(1)}</strong> pontos.</div>
        <div className="text-sm mb-2">Tempo mínimo de contribuição: <strong>{regras.tempoTransicao} anos</strong></div>
        <div className="text-base font-semibold mb-2 mt-4">Aposentadoria por Tempo de Contribuição (Transição por Idade)</div>
        <div className="text-sm mb-1">Idade mínima: <strong>{regras.idadeTransicao} anos</strong> e tempo mínimo: <strong>{regras.tempoTransicao} anos</strong></div>
        <div className="text-sm mb-1">Faltam <strong>{faltaIdadeTrans.toFixed(1)}</strong> anos de idade e <strong>{faltaTempoTrans.toFixed(1)}</strong> anos de contribuição.</div>
        <div className="text-base font-semibold mb-2 mt-4">Aposentadoria por Tempo de Contribuição (Transição Pedágio 50% e 100%)</div>
        <div className="text-sm mb-1">Essas regras são específicas para quem estava próximo de se aposentar em 2019. Consulte um especialista para detalhes.</div>
        <div className="text-base font-semibold mb-2 mt-4">Estimativa do valor do benefício</div>
        <div className="text-sm mb-1">Valor estimado: <strong>{valorBeneficio ? valorBeneficio.toLocaleString('pt-BR', {style:'currency',currency:'BRL'}) : '-'}</strong></div>
        <div className="text-xs text-neutral-400 mt-2">Cálculo: 60% do salário médio + 2% por ano que exceder o tempo mínimo de contribuição.</div>
      </div>

      <div className="text-xs text-neutral-400 text-center mt-6">
        <strong>Disclaimer:</strong> Esta é uma simulação simplificada, não constitui cálculo oficial nem aconselhamento previdenciário. Para informações oficiais, consulte o <a href="https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias" className="underline" target="_blank" rel="noopener noreferrer">site do INSS</a> ou um especialista.<br />
        <span className="italic">Regras consideradas: Aposentadoria por Idade, por Tempo de Contribuição (transição por pontos, idade, pedágio 50% e 100%).</span>
      </div>
    </div>
  )
}
