import { TRole } from "./user";

export interface IAuthData {
  id: string;
  user_id: string;
  expired_at: string;
  data: {
    roles: TRole[];
  };
}

export interface IRegisterPayload {
  email: string;
  job_title: string;
  name: string;
  password: string;
  repeat_password: string;
}

export interface IUpdateUserProfilePayload {
  job_title?: string;
  language?: string;
  name?: string;
  text_size?: number;
}

export interface IUpdateUserPayload {
  email: string;
  is_enabled: true;
  roles: string[];
}

export interface ICompanyRegisterPayload {
  email: string;
  company_name: string;
  password: string;
  repeat_password: string;
}
