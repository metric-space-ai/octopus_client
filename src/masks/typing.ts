import {ModelConfig} from '@/store/old';
import {type Mask} from '@/store/old/mask';

export type BuiltinMask = Omit<Mask, 'id' | 'modelConfig'> & {
  builtin: boolean;
  modelConfig: Partial<ModelConfig>;
};
