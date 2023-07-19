import {DEFAULT_MASK_AVATAR, Mask} from '@/store/old/mask';

import {Avatar} from './emoji';
// import {ModelConfigList} from './model-config';

export function MaskAvatar(props: {mask: Mask}) {
  return props.mask.avatar !== DEFAULT_MASK_AVATAR ? (
    <Avatar avatar={props.mask.avatar} />
  ) : (
    <Avatar model={props.mask.modelConfig.model} />
  );
}
