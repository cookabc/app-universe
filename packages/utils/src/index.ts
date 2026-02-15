export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN')
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num)
}
