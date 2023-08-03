import classNames from 'classnames';

import {LogoIcon, LogoTextIcon} from './svgs';

interface LogoProps {
  width?: number;
  height?: number;
  withText?: boolean;
  className?: string;
}

export const Logo = ({width = 56, height = 36, withText, className}: LogoProps) => (
  <div className={classNames('flex items-center gap-2', className)}>
    <LogoIcon width={width} height={height} />
    {withText && <LogoTextIcon />}
  </div>
);
