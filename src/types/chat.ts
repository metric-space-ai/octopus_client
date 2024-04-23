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
  media_type: 'video/mp4' | 'image/jpeg';
  created_at: string;
  deleted_at: string;
}

export interface IContentSafety {
  id: string;
  content_safety_disabled_until: string;
}

export interface IChatMessage {
  id: string;
  created_at: string;
  user_id: string;
  estimated_response_at: string;
  chat_id: string;
  chat_message_files: IChatMessageFile[];
  is_sensitive: boolean;
  is_anonymized: boolean;
  is_marked_as_not_sensitive: boolean;
  is_not_checked_by_system: boolean;
  message: string;
  response: string | null;
  status: 'Asked' | 'Answered';
  updated_at: string;
  profile: {
    id: string;
    user_id: string;
    name: string;
    photo_file_name: string;
  };
  simple_app_id: string | null;
  simple_app_data: string | null;
  wasp_app_id: string | null;
  ai_function_id: string | null;
  ai_function_error: string | null;
}

export interface IAiFunctionErrorParsed {
  file_attachments?: {
    content: string;
    file_name: string;
    media_type: string;
  }[];
  response?: string;
  error?: string;
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
  Text: {
    response: string;
  };
  file_attachements: File[];
}

export interface LanguageType {
  id: number;
  name: string;
}
