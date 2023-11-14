

interface IAIFunctionsProperties {
  [key: string]: {
    description: string;
    type: string;
  };
}

export interface IAIFunctions {
  id: string;
  ai_service_id: string;
  description: string;
  formatted_name: string;
  is_enabled: boolean;
  name: string;
  parameters: {
    properties: IAIFunctionsProperties;
    required: string[];
    type: string;
  };
  request_content_type: string;
  response_content_type: string;
  created_at: string;
  deleted_at: string | null;
  updated_at: string | null;
}
export interface IDocument {
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
  ai_functions: null | undefined | IAIFunctions[];
}

export interface IDeviceMap {
  cpu?: string;
}