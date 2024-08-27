import React, {useState} from 'react';

import Image, {ImageProps} from 'next/image';

interface Props extends ImageProps {
  src: string;
  alt: string;
  onErrorSrc?: string;
}

const Picture = ({src, alt, onErrorSrc, ...props}: Props) => {
  const [imageSource, setImageSource] = useState(src);
  const handleChangeImageSource = () => {
    if (onErrorSrc) setImageSource(onErrorSrc);
  };
  return <Image src={imageSource} alt={alt} {...props} onError={handleChangeImageSource} />;
};

export default Picture;
