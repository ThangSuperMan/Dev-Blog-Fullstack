import React from 'react';
import Image from 'next/image';
import LogoImage from '../../../public/images/logo.png';

const Logo: React.FC = () => {
  return (
    <div>
      <Image
        src={LogoImage}
        style={{ width: '50px', height: '40px' }}
        alt="Logo"
      />
    </div>
  );
};

export default Logo;
