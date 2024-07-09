export interface IWaspApp {
  id: string;
  wasp_generator_id?: string | null;
  allowed_user_ids: string[] | null;
  description: string;
  formatted_name: string;
  is_enabled: boolean;
  instance_type: EWaspInstanceType;
  name: string;
  created_at: string;
  updated_at: string | null;
}
export enum EWaspInstanceType {
  Shared = 'Shared',
  Private = 'Private',
  User = 'User',
}
