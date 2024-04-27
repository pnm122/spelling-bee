type Loadable<T, K> = 
  | { loading: true } & { data: undefined }
  | { loading: false } & { data: T }
  | { loading: false } & { data: undefined, error: K | undefined }

export type {Loadable as default}