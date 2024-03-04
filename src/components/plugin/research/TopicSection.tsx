import {Button} from '@/components/buttons';
import classNames from 'classnames';
import React, {useState} from 'react';
import {IKeywordsCollection, IPostTopicResponse, IPostTopicResponseParsed} from './types';
import apiHub from '@/hooks/useApiClient';
import {RESEARCHSTEPS} from './researchConstant';
import {AxiosError} from 'axios';
import toast from 'react-hot-toast';

type Props = {
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  setSpecifications: React.Dispatch<React.SetStateAction<IKeywordsCollection[] | undefined>>;
  setResearchSteps: React.Dispatch<React.SetStateAction<number>>;
};

const TopicSection = ({topic, setTopic, setSpecifications, setResearchSteps}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendNewTopict = async () => {
    if (!topic) return;
    setIsLoading(true);
    try {
      const {status, data} = await apiHub.post<IPostTopicResponse>('api/v1/ai-functions/direct-call', {
        name: 'topic',
        parameters: {topic},
      });

      if (status === 201) {
        if (data.Text?.response) {
          const parsedData: IPostTopicResponseParsed = JSON.parse(data.Text.response);
          if (parsedData.status === 'ok') {
            console.log({parsedData});
            setSpecifications(parsedData.result);
            setResearchSteps(RESEARCHSTEPS.Specification);
          }
        } else if (data.Error?.error) {
          const parsedData: {error: string} = JSON.parse(data.Error.error);
          toast.error(parsedData.error);
        }
      }
      // }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-between flex-1'>
      <div className='flex flex-1 relative items-center mb-5'>
        <textarea
          //   ref={inputRef}
          className={`w-full border py-2 px-4 pb-6 rounded-[18px] resize-none outline-none 
                            focus:border-content-black custom-scrollbar-thumb bg-content-grey-100`}
          placeholder='Topic Description'
          onInput={(e) => setTopic(e.currentTarget.value)}
          value={topic}
          //   onKeyDown={(e) => onInputKeyDown(e, answerInput, specifcations)}
          rows={15}
          autoFocus={true}
        />
        <span
          className={classNames(`text-content-grey-400 text-xs absolute right-3 bottom-2`, {
            '!text-content-red-600': topic.length > 1000,
          })}
        >{`${topic.length}/1000`}</span>
      </div>
      <Button
        title={isLoading ? '' : 'Confirm keywords'}
        variant='primary'
        onClick={handleSendNewTopict}
        className='rounded-[40px] w-[220px] !h-9'
        disabled={isLoading || !topic}
        loading={isLoading}
      />
    </div>
  );
};

export default TopicSection;
