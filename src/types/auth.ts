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

export interface IUpdateUserPayload {
  job_title?: string;
  language?: string;
  name?: string;
  text_size?: number;
}

export interface ICompanyRegisterPayload {
  email: string;
  company_name: string;
  password: string;
  repeat_password: string;
}
