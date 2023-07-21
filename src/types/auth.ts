export interface IAuthData {
  id: string;
  user_id: string;
  expired_at: string;
  data: {
    roles: string[];
  };
}

export interface IRegisterPayload {
  email: string;
  job_title: string;
  name: string;
  password: string;
  repeat_password: string;
}
