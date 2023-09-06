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
}
