type Loadable<T> = 
  | { loading: true }
  | { loading: false } & { data: T | undefined }

export type {Loadable as default}