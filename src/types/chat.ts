export interface ITicket {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  workspace_id: string;
}

export interface IChatMessageFile {
  id: string;
  chat_message_id: string;
  file_name: string;
  media_type: string;
  created_at: string;
  deleted_at: string;
}

export interface IChatMessage {
  id: string;
  created_at: string;
  user_id: string;
  estimated_response_at: string;
  chat_id: string;
  chat_message_files: [IChatMessageFile];
  is_sensitive: boolean;
  message: string;
  response: string;
  status: string;
  updated_at: string;
  profile: {
    id: string;
    user_id: string;
    name: string;
    photo_file_name: string;
  };
}

export interface TranslatorType {
  name: string;
  parameters: {
    source_language: string;
    target_language: string;
    text: string;
  };
}

export interface TranslatorResponse {
  id: string;
  progress: number;
  status: string;
  response: string;
  file_attachements: File[];
}

export interface LanguageType {
  id: number;
  name: string;
}
