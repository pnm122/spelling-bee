import type NotificationState from "$lib/types/notification";
import { writable } from "svelte/store";


const notificationState = writable<NotificationState>({
  open: false,
  type: 'default',
  title: '',
  message: ''
})

export function setNotification(title: string, message: string, type: 'default' | 'error') {
  notificationState.set({
    open: true,
    type,
    title,
    message
  })
}

export function notifyServerError() {
  notificationState.set({
    open: true,
    type: 'error',
    title: 'Internal server error',
    message: 'Please try again.'
  })
}

export default notificationState