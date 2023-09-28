import React, {ReactNode} from 'react';
import Select, {GroupBase, StylesConfig} from 'react-select';

export type DropdownOption = {
  key?: number | string;
  label: string | number;
  value: number | string | null;
};

type MultiSelectorProps = {
  isMulti?: true;
  onChange(value?: string[] | number[]): void;
  value?: (string | number | null)[];
};
type SingleSelectorProps = {
  isMulti?: false;
  value?: string | number;
  onChange(value?: string | number): void;
};
type Props = (MultiSelectorProps | SingleSelectorProps) & {
  options: DropdownOption[];
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  noOptionsMessage?(obj: {inputValue: string}): ReactNode;
  className?: string;
  menuPlacement?: 'top' | 'bottom' | 'auto';
  styles?: StylesConfig<DropdownOption, boolean, GroupBase<DropdownOption>> | undefined;
};

const CustomSelect: React.FC<Props> = (props) => {
  const {
    options,
    isDisabled = false,
    value,
    className,
    onChange,
    styles,
    placeholder,
    noOptionsMessage = () => <span>Not Found...</span>,
    ...rest
  } = props;

  return (
    <Select
      className='!border-0 font-poppins-medium text-xs '
      styles={{
        control: (base, props) => ({
          ...base,
          boxShadow: 'none',
          border: 'none',
          outline: 'none',
        }),
        indicatorSeparator: (base) => ({
          ...base,
          display: 'none',
        }),
        singleValue: (base) => ({
          ...base,
          fontSize: 12,
          color: '#1F1F1F',
        }),
      }}
      defaultValue={options[0]}
      isDisabled={isDisabled}
      isLoading={false}
      isClearable={false}
      isRtl={false}
      isSearchable={false}
      options={options}
      placeholder={placeholder || 'select'}
      onChange={(e: any) => {
        if (Array.isArray(e)) {
          const values = e.map((i) => i.value);
          // @ts-expect-error ts(2345)
          return onChange(values);
        }
        return onChange(e?.value);
      }}
      value={
        Array.isArray(value)
          ? options.filter((i) => value.includes?.(i.value))
          : options.find((i) => i.value === value) || null
      }
      {...rest}
    />
  );
};

export default CustomSelect;
