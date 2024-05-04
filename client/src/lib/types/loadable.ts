type Loadable<DataType, ErrorType> = 
  | { loading: true } & { data: undefined }
  | { loading: false } & { data: DataType }
  | { loading: false } & { data: undefined, error: ErrorType | undefined }

export type {Loadable as default}