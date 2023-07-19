import {useState} from 'react';

import {Tab, Tabs} from '@/components/tabs';

export const Header = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState('tab1');

  const handleTab = (idx: string) => {
    setSelectedTabIndex(idx);
  };

  return (
    <div className='flex'>
      <Tabs selectedId={selectedTabIndex} onChange={handleTab}>
        <Tab tabId='tab1' title='Public Group' />
        <Tab tabId='tab2' title='Private Group' />
      </Tabs>
    </div>
  );
};
