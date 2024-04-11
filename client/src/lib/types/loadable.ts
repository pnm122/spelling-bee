import type { ErrorTypes } from "$shared/interfaces/Response"

type Loadable<T, K extends ErrorTypes> = 
  | { loading: true } & { data: undefined }
  | { loading: false } & { data: T }
  | { loading: false } & { data: undefined, error: K | undefined }

export type {Loadable as default}