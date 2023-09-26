import {Button} from '@/components/buttons';
import {urltoFile} from '@/helpers/urlToFile';
import {useRef, useState, useCallback, SetStateAction, Dispatch} from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 380,
  height: 420,
  facingMode: 'user',
};

type Props = {
  setTakeImageModal: Dispatch<SetStateAction<boolean>>;
  setURLAvatar: Dispatch<SetStateAction<string>>;
  handleUpload: (payload: FormData) => void;
};

export default function WebCamImageTaker({setTakeImageModal, setURLAvatar, handleUpload}: Props) {
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
      setTakeImageModal(false);
      setURLAvatar(url);
      const formData = new FormData();

      // Usage example:
      const file = await urltoFile(url, 'user.jpg', 'image/jpeg');
      formData.append('file', file);
      handleUpload(formData);
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
              className=' rounded-20'
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              videoConstraints={videoConstraints}
            />
          </div>
          <div className='w-capture-button h-capture-button rounded-full ring-4 flex justify-center items-center ring-content-accent -bottom-10 absolute '>
            <button className='bg-content-accent w-84 h-84 rounded-full relative' title='capture' onClick={capture} />
          </div>
        </div>
      )}
      {url && !isCaptureEnable && (
        <div className='flex flex-col justify-center items-center'>
          <div className='w-full max-h-full'>
            <div className='mb-4'>
              <img src={url} alt='Screenshot' className='rounded-20' />
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
