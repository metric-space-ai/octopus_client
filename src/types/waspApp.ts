export interface IWaspApp {
  id: string;
  allowed_user_ids: string[] | null;
  description: string;
  formatted_name: string;
  is_enabled: boolean;
  name: string;
  created_at: string;
  deleted_at: string | null;
  updated_at: string | null;
}
