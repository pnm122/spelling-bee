export default interface Popup {
  open: boolean
  content: PopupContent
}

export type PopupContent = ConstructorOfATypedSvelteComponent | undefined