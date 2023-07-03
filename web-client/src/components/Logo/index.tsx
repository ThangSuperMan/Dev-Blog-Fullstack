import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LogoImage from '../../../public/images/logo.png';

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image src={LogoImage} width={50} height={40} alt="Logo" />
    </Link>
  );
};

export default Logo;
