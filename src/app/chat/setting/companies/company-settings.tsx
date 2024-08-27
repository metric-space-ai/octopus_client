/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';

import {ArrowPathIcon, ExclamationCircleIcon, PlusIcon, TrashIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {useFieldArray, useForm} from 'react-hook-form';
import toast from 'react-hot-toast';

import {Button, IconButton} from '@/components/buttons';
import {Input} from '@/components/input';
import {TextArea} from '@/components/textarea';
import {useAuthContext} from '@/contexts/authContext';
import {companyFormValidator} from '@/helpers/validators';

// type Props = {};

interface IFormInputs {
  name: string;
  address: string;
  allowedDomain: {domain: string}[];
}

const CompanySettings = () => {
  const {getCurrentUserCompany, currentUserCompany, putCurrentUserCompany, companyIsLoading} = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    control,
    reset,
  } = useForm<IFormInputs>({
    defaultValues: {
      address: '',
      name: '',
      allowedDomain: [{domain: ''}],
    },
  });

  const {fields, append, remove} = useFieldArray({
    name: 'allowedDomain',
    control,
  });

  const onSubmit = async (data: IFormInputs) => {
    if (currentUserCompany) {
      const {id} = currentUserCompany;
      const {name, address, allowedDomain} = data;
      const allowed_domains = allowedDomain.map((elem) => elem.domain);
      console.log({allowed_domains, name, address});
      console.log('submit update company...', data);
      const payload = {
        id,
        address: address ?? '-',
        name: name,
        allowed_domains,
      };
      putCurrentUserCompany(payload);
      // onLogin(email, password);
    }
  };

  const addDomainRow = () => {
    console.log({fields, values: watch().allowedDomain});

    if (watch().allowedDomain.every((field) => field.domain.length > 0)) {
      append({domain: ''});
    } else {
      toast.custom(
        () => (
          <div className='flex items-center bg-grey-0 p-4 rounded-lg shadow-lg'>
            <ExclamationCircleIcon className='w-6 h-6 mr-2 text-danger-300' />
            <div className='text-sm leading-normal'>Please fill the blank-field before adding a new one.</div>
          </div>
        ),
        {
          duration: 4000,
          position: 'top-right',
        },
      );
    }
  };
  useEffect(() => {
    if (currentUserCompany) {
      if (currentUserCompany.allowed_domains && currentUserCompany.allowed_domains.length > 0) {
        reset({
          name: currentUserCompany.name ?? '',
          address: currentUserCompany.address ?? '',
          allowedDomain: currentUserCompany.allowed_domains.map((domain) => ({
            domain,
          })),
        });
      } else {
        reset({
          name: currentUserCompany.name ?? '',
          address: currentUserCompany.address ?? '',
        });
      }
    }
  }, [currentUserCompany]);
  useEffect(() => {
    if (!currentUserCompany) getCurrentUserCompany;
  }, []);
  return (
    <div className='flex flex-col w-full px-4 py-4'>
      <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
        <h1 className='text-lg leading-7 text-grey-900 font-semibold'>Company Settings</h1>
      </div>
      <div className='w-full relative'>
        {companyIsLoading && !currentUserCompany && (
          <div className='flex w-full p-8 items-center justify-center h-[320px]'>
            <ArrowPathIcon className='w-11 h-11 animate-spin' />
          </div>
        )}
        {currentUserCompany && (
          <form
            className={classNames('w-full flex flex-col gap-6', companyIsLoading && 'pointer-events-none')}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label='Company Name'
              type='text'
              placeholder='Company Name'
              inputClassName='border border-border rounded-md px-5 py-2'
              inputCoverClassName='!p-0'
              className='flex flex-col gap-1'
              errors={errors.name && errors.name.message}
              rules={register('name', companyFormValidator.name)}
            />
            <TextArea
              className='w-full py-2 px-5 resize-none outline-none custom-scrollbar-thumb border border-border rounded-md'
              placeholder='country, state/province, city, street, ...'
              label='Address'
              rows={2}
              rules={register('address', companyFormValidator.address)}
            />

            <div className='w-full flex flex-col relative'>
              <div className='flex w-full max-w-sm items-center justify-between mb-4 relative'>
                <p className='text-xs'>Allowed Domains</p>
              </div>
              <div className='w-full flex flex-wrap gap-3 max-h-56 custom-scrollbar-thumb'>
                {fields.map((field, index) => (
                  <section className='flex gap-6 w-full max-w-xs items-start relative' key={field.id}>
                    <Input
                      type='text'
                      inputClassName='border border-border rounded-md px-5 py-2'
                      inputCoverClassName='!p-0'
                      className='flex flex-col w-full'
                      placeholder='example.com'
                      rules={register(`allowedDomain.${index}.domain`, {
                        required: false,
                        pattern: {
                          value: /^[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'Invalid domain format. It should be in the form example.com',
                        },
                      })}
                      errors={errors?.allowedDomain?.[index]?.domain?.message}
                    />
                    <IconButton
                      className='absolute top-1.5 right-1 bg-danger-500/50 hover:bg-danger-500/70'
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className='w-4 h-4 text-danger-500' />
                    </IconButton>
                  </section>
                ))}
                <div className='flex items-center px-3'>
                  <Button
                    title='Add Domain'
                    className='h-8'
                    type='button'
                    variant='secondary'
                    onClick={addDomainRow}
                    iconBefore={<PlusIcon className='w-5 h-5 text-gray-50' />}
                  />
                </div>
              </div>
            </div>
            <Button
              type='submit'
              className='mt-6 w-full !h-11 rounded-4xl'
              loading={companyIsLoading}
              disabled={companyIsLoading}
              title='Save Changes'
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanySettings;
