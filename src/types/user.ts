export interface IUserProfile {
  id: string;
  user_id: string;
  name: string;
  job_title: string;
  language: string;
  text_size: number;
  roles: string[];
  photo_file_name: string | null;
}
export interface IUser {
  email: string;
  is_enabled: true;
  roles: string[];
  company_id: string | null;
  created_at: string;
  deleted_at: string | null;
  id: string;
  updated_at: string | null;
}
