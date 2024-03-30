type Loadable<T> = 
  | { loading: true } & { data: undefined }
  | { loading: false } & { data: T | undefined }

export type {Loadable as default}