'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Notification from '@/components/Icons/Notification';
import Search from '@/components/Icons/Search';
import Logo from '@/components/Logo';
import AvatarImage from '../../../public/images/avatar.webp';

const Navbar: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  return (
    <nav className="flex justify-center items-center fixed top-0 right-0 left-0 bg-white">
      <div className="w-full h-14 max-w-screen-xl flex justify-between items-center px-4">
        <div className="flex items-center">
          <Logo />
          <div className="relative">
            <input
              className="w-[400px] h-10 px-2 py-[6.5px] ml-5 border-[1.5px] rounded-[6px] focus:border-indigo-100 "
              placeholder="Search..."
            />
            <button className="group w-10 h-[36px] px-2 flex justify-center items-center absolute right-[2px] top-[50%] translate-y-[-50%] rounded-[6px] cursor-pointer hover:bg-indigo-100">
              <Search />
            </button>
          </div>
        </div>
        {isSignedIn ? (
          <div className="flex items-center flex-nowrap">
            <button className="btn-primary">Create Post</button>
            <button className="group inline-flex justify-center items-center p-2 mx-1 rounded-[6px] cursor-pointer hover:bg-indigo-100">
              <Notification />
            </button>
            <Image
              src={AvatarImage}
              className="rounded-full p-1 cursor-pointer"
              width={40}
              height={40}
              alt="Avatar"
            />
          </div>
        ) : (
          <div>
            <Link href="/enter">
              <button className="h-10 py-[7px] px-[15px] mr-2 rounded-[6px] hover:bg-indigo-100 hover:text-indigo-700">
                Log in
              </button>
            </Link>
            <button className="btn-primary">Create account</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
