export interface IFile {
  id: string;
  company_id: string;
  user_id: string;
  access_type: string;
  file_name: string;
  media_type: string;
  original_file_name: string;
  type: IFileType;
  url: string;
  created_at: string;
  updated_at: string;
  // "id": "fde0b1d0-64db-4d42-967a-8f1827e139ef",
  // "company_id": "85635696-7d21-4870-943d-3b290ac43efc",
  // "user_id": "26178dd8-60a1-4b47-84db-7ffbff8b8ebc",
  // "access_type": "Company",
  // "file_name": "a3355804-08d6-4627-938b-db15a7c56e5f.json",
  // "media_type": "application/octet-stream",
  // "original_file_name": "Understanding Moore's Law in Semiconductor Scaling.json",
  // "type": "KnowledgeBook",
  // "url": "https://api.preview.octopus-ai.app/public/a3355804-08d6-4627-938b-db15a7c56e5f.json",
  // "created_at": "2024-08-14T12:28:34Z",
  // "updated_at": "2024-08-14T12:28:34Z"
}

export enum IFileType {
  Document = 'Document',
  KnowledgeBook = 'KnowledgeBook',
  Normal = 'Normal',
  TaskBook = 'TaskBook',
}

export interface IKnoledgebook {
  book: string;
  topic: string;
  outline: string;
  model: string;
  chapters: string[];
  sources: string[];
}

export interface IDocumentMarkdown {
  summary: string;
  markdown: string;
}
