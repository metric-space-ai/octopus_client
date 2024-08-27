export type TCompany = {
  id: string;
  address: string | null;
  custom_style: string | null;
  allowed_domains: string[] | null;
  name: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};
