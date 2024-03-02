export default function getTodaysDate() {
  const d = new Date(Date.now())

  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}