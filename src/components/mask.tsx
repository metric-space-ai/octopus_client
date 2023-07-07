import {Avatar} from './emoji';
// import {ModelConfigList} from './model-config';
import {DEFAULT_MASK_AVATAR, Mask} from '../store/mask';

export function MaskAvatar(props: {mask: Mask}) {
  return props.mask.avatar !== DEFAULT_MASK_AVATAR ? (
    <Avatar avatar={props.mask.avatar} />
  ) : (
    <Avatar model={props.mask.modelConfig.model} />
  );
}
