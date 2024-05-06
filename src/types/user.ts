export type TRole = 'ROLE_ADMIN' | 'ROLE_COMPANY_ADMIN_USER' | 'ROLE_PRIVATE_USER' | 'ROLE_PUBLIC_USER' | '';
export type PartialTRoleLabel = Partial<Record<TRole, string>>;

export interface IUserProfile {
  id: string;
  user_id: string;
  name: string;
  job_title: string;
  language: string;
  text_size: number;
  roles: TRole[];
  photo_file_name: string | null;
}
export interface IUser {
  email: string;
  is_enabled: true;
  roles: TRole[];
  company_id: string | null;
  created_at: string;
  deleted_at: string | null;
  id: string;
  updated_at: string | null;
  profile?: IUserProfile;
}
export interface IUserSetup {
  registration_allowed: boolean;
  setup_required: boolean;
}
export interface ICreateUser {
  email: string;
  is_enabled: true;
  roles: TRole[];
  name: string;
  job_title: string;
  password: string;
  repeat_password: string;
}
