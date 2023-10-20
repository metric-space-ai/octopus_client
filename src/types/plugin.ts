export interface IPlugin {
  id: string;
  device_map: string | null;
  health_check_execution_time: number;
  health_check_status: string;
  is_enabled: boolean;
  original_file_name: string;
  original_function_body: string;
  port: number;
  processed_function_body: string | null;
  progress: number;
  required_python_version: string;
  setup_execution_time: number;
  setup_status: string;
  status: string;
  created_at: string;
  deleted_at: null;
  health_check_at: string | null;
  setup_at: string | null;
  updated_at: string;
}

export interface IDeviceMap {
  cpu?: string;
}
interface IGpus {
  id: string;
  memory_free: string;
  memory_total: string;
  memory_used: string;
  name: string;
}

export interface IResources {
  cpus: number;
  device_map: IDeviceMap;
  gpus: IGpus[] | [];
  memory_free: string;
  memory_total: string;
  memory_used: string;
  physical_cpus: number;

  // device_map: {
  //   additionalProp1: 'string';
  //   additionalProp2: 'string';
  //   additionalProp3: 'string';
  // };
}
