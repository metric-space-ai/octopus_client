import {Dispatch, SetStateAction, useCallback, useRef, useState} from 'react';

import Image from 'next/image';
import Webcam from 'react-webcam';

import {Button} from '@/components/buttons';
import {urltoFile} from '@/helpers/urlToFile';

const videoConstraints = {
  width: 380,
  height: 420,
  facingMode: 'user',
};

type Props = {
  setTakeImageModal: Dispatch<SetStateAction<boolean>>;
  handleUpload: (payload: FormData) => void;
};

export default function WebCamImageTaker({setTakeImageModal, handleUpload}: Props) {
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(true);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
    setCaptureEnable(false);
  }, [webcamRef]);

  const handleSaveUserImage = async () => {
    if (url) {
      const formData = new FormData();
      const file = await urltoFile(url, 'user.jpg', 'image/jpeg');
      formData.append('file', file);
      handleUpload(formData);

      setTakeImageModal(false);
    }
  };

  return (
    <>
      {isCaptureEnable && (
        <div className='flex flex-col justify-center items-center relative mb-11'>
          <div className='w-full max-h-full'>
            <Webcam
              mirrored
              audio={false}
              width={380}
              height={420}
              className=' rounded-xl'
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              videoConstraints={videoConstraints}
            />
          </div>
          <div className='w-capture-button h-capture-button rounded-full ring-4 flex justify-center items-center ring-primary -bottom-10 absolute '>
            <button className='bg-primary w-84 h-84 rounded-full relative' title='capture' onClick={capture} />
          </div>
        </div>
      )}
      {url && !isCaptureEnable && (
        <div className='flex flex-col justify-center items-center'>
          <div className='w-full max-h-full'>
            <div className='mb-4'>
              <Image width={380} height={420} src={url} alt='camera image' className='rounded-xl' />
            </div>

            <div className='flex flex-wrap w-full justify-between'>
              <div className='w-1/2 pr-2'>
                <Button
                  variant='transparent'
                  title='Retake'
                  className='border w-full'
                  onClick={() => {
                    setUrl(null);
                    setCaptureEnable(true);
                  }}
                />
              </div>
              <div className='w-1/2 pl-2'>
                <Button variant='primary' title='Use photo' className='w-full' onClick={handleSaveUserImage} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
