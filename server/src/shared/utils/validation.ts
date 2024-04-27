export const MIN_USERNAME_LENGTH = 4 as const
export const MAX_USERNAME_LENGTH = 16 as const
export const MIN_PASSWORD_LENGTH = 8 as const
export const MAX_PASSWORD_LENGTH = 24 as const
export const ALLOWED_SPECIAL_CHARACTERS = '!@#$%^&*+' as const

export function isValidUsername(u: string): boolean {
  const regex = new RegExp(`^[a-zA-Z0-9]{${MIN_USERNAME_LENGTH},${MAX_USERNAME_LENGTH}}$`)
  return u.match(regex) != null
}

export function isValidPassword(p: string): boolean {
  const regex = new RegExp(`^[a-zA-Z0-9${ALLOWED_SPECIAL_CHARACTERS}]{${MIN_PASSWORD_LENGTH},${MAX_PASSWORD_LENGTH}}$`)
  return p.match(regex) != null
}