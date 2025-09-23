export function parseBRInt(value: string): number {
  // aceita “150.000” ou “150000”
  const onlyDigits = value.replace(/[^\d]/g, "")
  return onlyDigits ? parseInt(onlyDigits, 10) : 0
}

export function formatBRInt(n: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n)
}
