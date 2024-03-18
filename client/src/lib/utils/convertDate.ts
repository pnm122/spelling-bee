const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

/** 
* Convert a date from mm/dd/yyyy form to a UI-usable format
* @param {ParamDataTypeHere} date - A date in mm/dd/yyyy form
* @return {ReturnValueDataTypeHere} A date in Month dd(th/nd/st/rd) yyyy
*/
export default function convertDate(date: string): string {
  if(date.length != 10) return 'INVALID DATE'

  const s = date.split('/')
  if(s.length != 3) return 'INVALID DATE'

  const month = parseInt(s[0])
  const day = parseInt(s[1])
  const year = s[2]

  if(month > 12 || month < 1) return 'INVALID DATE'

  const monthFormatted = MONTHS[month - 1]
  const dayFormatted = `${day}${day % 10 == 1 ? 'st' : day % 10 == 2 ? 'nd' : day == 3 || day == 23 ? 'rd' : 'th'}`

  return `${monthFormatted} ${dayFormatted} ${year}`
}