import { TMedtaTypes } from "./chat";

export interface IDocument {
  created_at: string;
  file_name:  string;
  id: string;
  media_type: TMedtaTypes;
  original_file_name: string;
  updated_at: string;
}
