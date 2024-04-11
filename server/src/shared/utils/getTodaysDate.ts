export default function getTodaysDate() {
  // Difference in ms between GMT and EST
  const EST_OFFSET = 1000 * 60 * 60 * 4

  // Offset the date so that it's always centered on EST timezone
  const date = new Date(Date.now() - EST_OFFSET)

  // Use UTC getters so that the time is the same no matter where the server is located
  const m = date.getUTCMonth() + 1
  const d = date.getUTCDate()
  const y = date.getUTCFullYear()

  return `${m < 10 ? '0' : ''}${m}/${d < 10 ? '0' : ''}${d}/${y}`
}