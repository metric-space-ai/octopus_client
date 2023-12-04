export interface IAppActivation {
  operation: 'Disable' | 'Enable';
  is_enabled: boolean;
}

export interface IApp {
  id: string;
  device_map: string | null;
  health_check_execution_time: number;
  health_check_status: 'Ok' | 'NotWorking';
  is_enabled: boolean;
  original_file_name: string;
  original_function_body: string;
  port: number;
  processed_function_body: string | null;
  progress: number;
  required_python_version: string;
  setup_execution_time: number;
  setup_status: 'Performed' | 'NotPerformed';
  status:
    | 'Configuration'
    | 'Error'
    | 'Initial'
    | 'InstallationFinished'
    | 'InstallationStarted'
    | 'MaliciousCodeDetected'
    | 'ParsingFinished'
    | 'ParsingStarted'
    | 'Running'
    | 'Setup'
    | 'Stopped';
  created_at: string;
  deleted_at: null;
  health_check_at: string | null;
  setup_at: string | null;
  updated_at: string;
  ai_functions: null | undefined;
  parser_feedback: string | null;
}

