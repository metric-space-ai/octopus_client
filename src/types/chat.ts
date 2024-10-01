export interface ITicket {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  workspace_id: string;
}

export type TMedtaTypes =
  | 'video/mp4'
  | 'image/jpeg'
  | 'image/png'
  | 'text/plain'
  | 'application/pdf'
  | 'text/html'
  | 'audio/aa';

export interface IChatMessageFile {
  id: string;
  chat_message_id: string;
  file_name: string;
  media_type: TMedtaTypes | string;
  created_at: string;
  deleted_at: string | null;
  original_file_name?: string;
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
  color?: null | string;
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
  ai_service_id: null | string;
  scheduled_prompt_id: null | string;
  suggested_ai_function_id: null | string;
  ai_function_call: {
    arguments: {
      title: string;
    };
    name: string;
  };
  bad_reply_comment: null | string;
  bad_reply_is_harmful: boolean;
  bad_reply_is_not_helpful: boolean;
  bad_reply_is_not_true: boolean;
  bypass_sensitive_information_filter: boolean;
  progress: number;
  suggested_llm: null | string;
  suggested_model: null | string;
  suggested_secondary_model: boolean;
  used_llm: string;
  used_model: string;
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
  Mixed?: [
    {
      Text?: {
        response: string;
      };
    },
  ];
  Error?: {
    error: string;
  };
}
// export interface TranslatorResponse {
//   id: string;
//   progress: number;
//   status: string;
//   Text: {
//     response: string;
//   };
//   file_attachements: File[];
// }

export interface LanguageType {
  id: number;
  name: string;
}
