import React from 'react';

import classNames from 'classnames';

import {TabProps} from './tab';

type TabsProps = {
  className?: string;
  selectedId: string;
  size?: 'large' | 'medium' | 'small';
  children: React.ReactNode;
  onChange: (index: string) => void;
};

export const Tabs = ({className, selectedId, children, onChange, ...props}: TabsProps) => {
  return (
    <div className={classNames('flex justify-center', className)} {...props}>
      {React.Children.toArray(children)
        .filter((child) => React.isValidElement(child))
        .map((child) => {
          if (!React.isValidElement<TabProps>(child)) {
            return child;
          }
          return React.cloneElement(child, {
            isFocused: selectedId === child.props.tabId,
            onClick: () => {
              onChange(child.props.tabId);
            },
          });
        })}
    </div>
  );
};
