import React from 'react';
import GoogleIcon from '@/components/Icons/Google';
import Twitter from '@/components/Icons/Twitter';

const Login: React.FC = () => {
  return (
    <div className="flex justify-center p-4">
      <div className="max-w-[640px] bg-white p-12 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold leading-[37.6px]">
          Welcome to DEV Community
        </h1>
        <p>DEV Community is a community of 1,093,159 amazing developers</p>
        <div className="grid gap-2 mt-7">
          <button className="btn-social hover:bg-red-500 transition-all">
            <GoogleIcon />
            <span className="ml-2 text-white">Continue with Google</span>
          </button>
          <button className="btn-social bg-twitter-brand">
            <Twitter />
            <span className="ml-2 text-white">Continue with Twitter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
