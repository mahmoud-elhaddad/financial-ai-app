export interface IUserDetails {
  fn: string;
  fullName: string;
  id: string;
  ln: string;
  mn: string;
  pi: string | null;
  rd: string;
}

export interface IUserFilterRequest {
  page: number;
  limit: number;
  mobileNumber?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  name?: string | null;
  status?: string | null
}
