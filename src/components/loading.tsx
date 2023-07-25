import {Spinner} from './spinner';

export function Loading() {
  return (
    <div className='flex flex-col w-full h-full items-center justify-center'>
      <Spinner size='medium' />
    </div>
  );
}
