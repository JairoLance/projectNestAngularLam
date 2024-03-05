export interface ApiResponse<T> {
  [x: string]: any;
  message?: string;
  T: any
  // data: T;
}

export interface IEmployee {
  id?: string;
  names: string;
  surnames: string;
  typeDocument: string;
  document: string;
  phone: string;
  address : string,
  age: string;
  createdAt: string;
  updatedAt: string;
}

