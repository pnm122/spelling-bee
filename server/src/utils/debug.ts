type Mode ='development' | 'production' | undefined
type LogMode = 'log' | 'warn' | 'error'

const mode = process.env.NODE_ENV as Mode

// Log to the console if in development mode
export default function debug(
  message: any,
  logMode: LogMode = 'log'
) {
  if(!mode || mode != 'development') return

  if(logMode == 'log')        console.log(message)
  else if(logMode == 'warn')  console.warn(message)
  else if(logMode == 'error') console.error(message)
}