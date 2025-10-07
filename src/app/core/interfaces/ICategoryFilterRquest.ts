export interface ICategoryFilterRequest {
  page: number;
  limit: number;
  fullName?: string;
}

export interface ICategoryDetails {
  arN: string;
  enN: string;
  _id: string;
}