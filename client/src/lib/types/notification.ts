export default interface NotificationState {
  open: boolean
  type: 'default' | 'error'
  title: string
  message: string
}