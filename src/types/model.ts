export type TOllamaModel = string;
export interface IModel {
  created_at: string;
  deleted_at: string;
  id: string;
  name: string;
  o_details_families: string[];
  o_details_family: string;
  o_details_format: string;
  o_details_parameter_size: string;
  o_details_parent_model: string;
  o_details_quantization_level: string;
  o_digest: string;
  o_model: string;
  o_modified_at: string;
  o_name: string;
  o_size: string;
  status: string;
  updated_at: string;
}
