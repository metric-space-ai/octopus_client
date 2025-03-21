export interface IPluginActivation {
  operation: 'Disable' | 'Enable';
  is_enabled: boolean;
}

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
  display_name: string;
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
  generated_description: string | null;
}

export type TRecordPluginStatus = Record<TPluginStatus, TPluginStatus>;
export type TPartialPluginStatus = Partial<TPluginStatus>;

export type TWaspAppBgColor = {
  id: string;
  value: string;
  label: string;
};

export type TPluginStatus =
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

export interface IPlugin {
  id: string;
  device_map: IDeviceMap | null;
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
  status: TPluginStatus;
  created_at: string;
  deleted_at: null;
  health_check_at: string | null;
  setup_at: string | null;
  updated_at: string;
  ai_functions: null | undefined | IAIFunctions[];
  parser_feedback: string | null;
  allowed_user_ids?: string[];
  type: 'Normal' | 'System';
  color: string | null;

  ai_service_generator_id?: null | string;
  priority?: number;
}

export interface IDeviceMap {
  // cpu?: string;
  [key: string]: string;
}
export interface IGpus {
  id: string;
  memory_free: string;
  memory_total: string;
  memory_used: string;
  name: string;
  cuda: string;
}

export interface IResources {
  cpus: number;
  device_map: IDeviceMap;
  gpus: IGpus[] | [];
  memory_free: string;
  memory_total: string;
  memory_used: string;
  physical_cpus: number;
}
