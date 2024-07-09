import {Button} from '@/components/buttons';
import {useAuthContext} from '@/contexts/authContext';
import {useThemeStore} from '@/store/themeData';
import {IThemeData, TCompany} from '@/types';
import classNames from 'classnames';
import React, {ChangeEvent, useEffect, useState} from 'react';
import toast from 'react-hot-toast';

type Props = {};

const companies = (props: Props) => {
  const {getCurrentUserCompany, currentUserCompany, putCurrentUserCompany, companyIsLoading} = useAuthContext();
  const {themeData, handleSetColorVariable} = useThemeStore();

  // const [companyDetails, setCompanyDetails] = useState<TCompany>();
  const [isLoading, setIsLoading] = useState(false);
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
    <div className='flex gap-6 pt-9'>
      <div className='w-full flex flex-col px-6'>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-xl bg-grey-0'>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='text-lg leading-7 text-grey-900 font-semibold'>Theme</h1>
          </div>
          {isLoading && (
            <div className='flex flex-col justify-start py-3 items-center animate-pulse gap-3'>
              <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-80'></div>
              <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-80'></div>
            </div>
          )}
          {!isLoading && (
            <div className={classNames('flex flex-col', companyIsLoading && 'pointer-events-none')}>
              <label className='flex gap-4 text-sm mb-8 items-center'>
                <b className='block'>Upload your Json file:</b>
                <input type='file' accept='.json' onChange={handleFileChange} />
              </label>
              <div className='flex flex-col gap-3 resize-none custom-scrollbar-thumb mb-6'>
                <div>
                  <h2>Edit:</h2>
                  <textarea
                    className='w-full border border-primary-150'
                    rows={10}
                    value={fileContent ?? ''}
                    // onChange={({target}) => setFileContent(target.value)}
                    onChange={handleChangeContent}
                  ></textarea>
                </div>
              </div>
              <div className='flex justify-start gap-6'>
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
          )}
        </div>
      </div>
      <div className='flex flex-col p-4 gap-3 border text-sm w-[300px] max-h-[480px] h-full custom-scrollbar-thumb'>
        <div className='flex gap-3 items-center justify-between'>
          <b>primary-default</b>
          <span className='border shadow-md rounded-md block w-16 h-4 bg-primary' />
        </div>
        <div className='flex gap-3 items-center justify-between'>
          <b>primary-medium</b>
          <span className='border shadow-md rounded-md block w-16 h-4 bg-primary-medium' />
        </div>
        <div className='flex gap-3 items-center justify-between'>
          <b>primary-regular</b>
          <span className='border shadow-md rounded-md block w-16 h-4 bg-primary-400' />
        </div>
        <div className='flex gap-3 items-center justify-between'>
          <b>secondary-default</b>
          <span className='border shadow-md rounded-md block w-16 h-4 bg-secondary' />
        </div>
        <div className='flex gap-3 items-center justify-between'>
          <b>secondary-deep</b>
          <span className='border shadow-md rounded-md block w-16 h-4 bg-secondary-700' />
        </div>
        <div className='flex gap-3 items-center justify-between'>
          <b>secondary-soft</b>
          <span className='border shadow-md rounded-md block w-16 h-4 bg-secondary-soft' />
        </div>
        <div className='flex gap-3 items-center justify-between'>
          <b>success</b>
          <span className='border shadow-md rounded-md block w-16 h-4 bg-success' />
        </div>
        <div className='flex gap-3 items-center justify-between'>
          <b>error</b>
          <span className='border shadow-md rounded-md block w-16 h-4 bg-danger' />
        </div>
        <div className='flex gap-3 items-center justify-between'>
          <b>background</b>
          <span className='border shadow-md rounded-md block w-16 h-4 bg-background' />
        </div>
      </div>
    </div>
  );
};

export default companies;
