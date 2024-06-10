import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({className}: SearchBarProps) => {
  return (
    <div className={classNames('flex h-9 px-4 py-[6px] bg-grey-0 rounded-5xl items-center', className)}>
      <MagnifyingGlassIcon className='w-5 h-5 text-grey-600' />
      <input className='ml-2 text-base text-grey-600 bg-transparent outline-none' placeholder='Search' />
    </div>
  );
};
