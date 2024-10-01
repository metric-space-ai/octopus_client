export interface IScheduledPrompts {
  id: string;
  chat_id: string;
  user_id: string;
  desired_schedule: string;
  job_id: null | string;
  prompt: string;
  schedule: null | string;
  created_at: string;
  deleted_at: null | string;
  updated_at: null | string;
}

export interface TCreateScheduledPromptsBody {
  desired_schedule: string;
  prompt: string;
}
