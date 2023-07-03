import React from 'react';
import Logo from '../Logo';
import Notification from '@/components/Icons/Notification';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-center">
      <div className="max-w-[1248px] px-4 bg-red-200">
        <Logo />
        <div>
          <button className="outline outline-1 rounded-sm outline-indigo-400 px-[15px] py-[7px] mr-2 hover:underline hover:text-white hover:bg-blue-400">
            Create Post
          </button>
          <button>
            <Notification />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
