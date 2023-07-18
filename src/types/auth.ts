export interface IAuthResponse {
  id: string;
}

export interface IRegisterPayload {
  email: string;
  job_title: string;
  name: string;
  password: string;
  repeat_password: string;
}
