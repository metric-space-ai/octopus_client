type WorkspaceType = 'Public' | 'Private';
export interface IWorkspace {
  id: string;
  company_id: string;
  user_id: string;
  name: string;
  type: WorkspaceType;
  created_at: string;
}