import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

async function fetchHTMLSelicFromBCBPage(): Promise<number | null> {
  try {
    const url = "https://www.bcb.gov.br/estatisticas/detalhamentoGrafico/graficosestatisticas/metaselic"
    const r = await fetch(url, { mode: "cors" })
    if (!r.ok) return null
    const html = await r.text()
    // tenta achar algo como "xx,xx%" no HTML
    const m = html.match(/(\d{1,2},\d{1,2})\s*%/)
    if (m?.[1]) {
      const v = parseFloat(m[1].replace(",", "."))
      if (Number.isFinite(v)) return v
    }
    return null
  } catch {
    return null
  }
}

async function fetchSGS(code: number) {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados/ultimo?formato=json`
  const r = await fetch(url)
  if (!r.ok) throw new Error(`Falha ao buscar série ${code}`)
  const arr = await r.json() as { data: string; valor: string }[]
  const valor = arr?.[0]?.valor
  return valor ? parseFloat(valor.replace(",", ".")) : NaN
}

export function TaxasHoje({ hideRefresh = false }: { hideRefresh?: boolean }) {
  const [selic, setSelic] = useState<number | null>(null) // a.a.
  const [cdiAA, setCdiAA] = useState<number | null>(null) // a.a.
  const [fonte, setFonte] = useState<"bcb-page"|"sgs"|"fallback">("fallback")

  useEffect(() => {
    let cancel = false
    ;(async () => {
      // 1) tenta página indicada
      const selicFromPage = await fetchHTMLSelicFromBCBPage()
      if (!cancel && Number.isFinite(selicFromPage as number)) {
        setSelic(selicFromPage as number)
        setFonte("bcb-page")
      }

      // 2) busca CDI + (se selic faltou) SGS
      try {
        const [cdiDia, selicMetaAA] = await Promise.all([
          fetchSGS(12).catch(() => NaN),   // CDI diário (% a.d.)
          fonte === "bcb-page" ? Promise.resolve(NaN) : fetchSGS(432).catch(() => NaN), // SELIC meta
        ])

        if (cancel) return

        if (!Number.isFinite(selic as number) && Number.isFinite(selicMetaAA)) {
          setSelic(selicMetaAA as number)
          setFonte("sgs")
        }

        if (Number.isFinite(cdiDia)) {
          const dia = (cdiDia as number) / 100
          const aa = (Math.pow(1 + dia, 252) - 1) * 100
          setCdiAA(aa)
        } else {
          setCdiAA(null)
        }
      } catch {
        // ignora -> vai pro fallback
      }

      // 3) fallback se necessário
      if (!Number.isFinite(selic as number) || !Number.isFinite(cdiAA as number)) {
        setSelic((prev) => (Number.isFinite(prev as number) ? prev : 10.75))
        setCdiAA((prev) => (Number.isFinite(prev as number) ? prev : 10.9))
        if (fonte !== "bcb-page" && fonte !== "sgs") setFonte("fallback")
      }
    })()
    return () => { cancel = true }
  }, []) // eslint-disable-line

  return (
    <Card>
  <CardContent className="p-4 text-[15px] flex items-center gap-4">
        <div className="font-medium">
          Taxas de referência: {fonte === "bcb-page" ? "BCB (página Meta Selic)" : fonte === "sgs" ? "BCB (SGS)" : "fallback"}
        </div>
        <div className="text-muted-foreground">
          CDI (anualizado): {cdiAA != null ? `${cdiAA.toFixed(2)}% a.a.` : "—"}
        </div>
        <div className="text-muted-foreground">
          SELIC (meta): {selic != null ? `${selic.toFixed(2)}% a.a.` : "—"}
        </div>
        {!hideRefresh && (
          <div className="ml-auto text-muted-foreground">
            carregado automaticamente
          </div>
        )}
      </CardContent>
    </Card>
  )
}
