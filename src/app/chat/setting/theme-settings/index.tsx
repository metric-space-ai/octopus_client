/* eslint-disable react-hooks/exhaustive-deps */
import React, {ChangeEvent, useEffect, useState} from 'react';

import classNames from 'classnames';
import toast from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {useAuthContext} from '@/contexts/authContext';
import {useThemeStore} from '@/store/themeData';
import {IThemeData} from '@/types';

const ThemeSettings = () => {
  const {getCurrentUserCompany, currentUserCompany, putCurrentUserCompany, companyIsLoading} = useAuthContext();
  const {themeData, handleSetColorVariable} = useThemeStore();

  const [previewIsOn, setPreviewIsOn] = useState(false);
  const [contentIsChanged, setContentIsChanged] = useState(false);

  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[files.length - 1];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileContent(text);
      };
      reader.readAsText(file);
      setContentIsChanged(true);
    }
  };

  const handlePreview = () => {
    if (!fileContent) return toast.error('please fill the content or upload your JSON file ');
    setPreviewIsOn(true);
    const parsedData: IThemeData = JSON.parse(fileContent);
    if (!parsedData || !parsedData.cssVariables) return toast.error('the json is not valid');
    handleSetColorVariable(parsedData.cssVariables);
  };

  const handleChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value);
    setContentIsChanged(true);
  };

  const handleSubmitChanges = async () => {
    if (!currentUserCompany) return;
    if (!fileContent) return toast.error('file content is empty');
    const {address, id, name} = currentUserCompany;
    const payload = {
      id,
      address: address ?? '-',
      name: name ?? '-',
      custom_style: fileContent,
    };
    putCurrentUserCompany(payload);
  };

  useEffect(() => {
    if (themeData) setFileContent(JSON.stringify(themeData, null, 3));
  }, [themeData]);
  useEffect(() => {
    if (!currentUserCompany) getCurrentUserCompany;

    return setPreviewIsOn(false);
  }, []);

  useEffect(() => {
    if (!previewIsOn) handleSetColorVariable(themeData.cssVariables);
  }, [previewIsOn]);

  return (
    <>
      <div className='flex justify-between items-center w-full'>
        <h1 className='text-lg leading-7 text-grey-900 font-semibold'>Theme Settings</h1>
      </div>
      <div className='flex gap-6'>
        <div className='w-full flex flex-col pt-4'>
          <div className='flex flex-col w-full max-w-[570px] flex-1'>
            <div className={classNames('flex flex-col flex-1', companyIsLoading && 'pointer-events-none')}>
              <label className='flex flex-col gap-2 text-sm mb-8 items-start cursor-pointer'>
                <b className='block'>Upload your Json file:</b>
                <input type='file' accept='.json' onChange={handleFileChange} />
              </label>
              <div className='flex flex-col gap-3 resize-none custom-scrollbar-thumb mb-6'>
                <div>
                  <h2>Edit:</h2>
                  <textarea
                    className='w-full border border-primary-150 resize-none'
                    rows={10}
                    value={fileContent ?? ''}
                    // onChange={({target}) => setFileContent(target.value)}
                    onChange={handleChangeContent}
                  ></textarea>
                </div>
              </div>
              <div className='flex justify-start gap-6 mt-auto'>
                {previewIsOn && (
                  <Button
                    className='!px-6 font-semibold text-sm !h-34-px'
                    variant='secondary'
                    title='Close Preview'
                    onClick={() => setPreviewIsOn(false)}
                  />
                )}
                {!previewIsOn && (
                  <Button
                    className={classNames(
                      '!px-6 font-semibold text-sm !h-34-px',
                      !contentIsChanged && 'pointer-events-none',
                    )}
                    variant='primary'
                    disabled={!contentIsChanged}
                    title='Preview'
                    onClick={handlePreview}
                  />
                )}

                <Button
                  className='!px-6 font-semibold text-sm !h-34-px w-[170px]'
                  variant={!contentIsChanged || !fileContent ? 'disabled' : 'primary'}
                  title={companyIsLoading ? '' : 'Submit changes'}
                  disabled={!contentIsChanged || !fileContent}
                  loading={companyIsLoading}
                  onClick={handleSubmitChanges}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col p-4 gap-3 border text-sm w-[300px] max-h-[480px] h-full custom-scrollbar-thumb'>
          <div className='flex gap-3 items-center justify-between'>
            <b>primary-default</b>
            <span className='border shadow-md rounded-md block w-5 h-5 bg-primary' />
          </div>
          <div className='flex gap-3 items-center justify-between'>
            <b>primary-medium</b>
            <span className='border shadow-md rounded-md block w-5 h-5 bg-primary-medium' />
          </div>
          <div className='flex gap-3 items-center justify-between'>
            <b>primary-regular</b>
            <span className='border shadow-md rounded-md block w-5 h-5 bg-primary-400' />
          </div>
          <div className='flex gap-3 items-center justify-between'>
            <b>secondary-default</b>
            <span className='border shadow-md rounded-md block w-5 h-5 bg-secondary' />
          </div>
          <div className='flex gap-3 items-center justify-between'>
            <b>secondary-deep</b>
            <span className='border shadow-md rounded-md block w-5 h-5 bg-secondary-700' />
          </div>
          <div className='flex gap-3 items-center justify-between'>
            <b>secondary-soft</b>
            <span className='border shadow-md rounded-md block w-5 h-5 bg-secondary-soft' />
          </div>
          <div className='flex gap-3 items-center justify-between'>
            <b>success</b>
            <span className='border shadow-md rounded-md block w-5 h-5 bg-success' />
          </div>
          <div className='flex gap-3 items-center justify-between'>
            <b>error</b>
            <span className='border shadow-md rounded-md block w-5 h-5 bg-danger' />
          </div>
          <div className='flex gap-3 items-center justify-between'>
            <b>background</b>
            <span className='border shadow-md rounded-md block w-5 h-5 bg-background' />
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeSettings;
