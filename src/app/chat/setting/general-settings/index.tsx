'use client';

import LanguageSettings from '@/components/language-settings';
import SelectBaseFontSize from '@/components/select-base-font-size';
import {useAuthContext} from '@/contexts/authContext';

const GeneralSettings = () => {
  const {user, onUpdateProfile} = useAuthContext();

  return (
    <div className='w-full pt-[84px] flex flex-col items-center'>
      <div className='flex flex-col w-full max-w-sm'>
        <div className='mb-6 relative'>
          <LanguageSettings currentLanguage={user?.language} user={user} />
        </div>
        <SelectBaseFontSize user={user} currentSize={user?.text_size} onUpdateProfile={onUpdateProfile} />
      </div>
    </div>
  );
};

export default GeneralSettings;
