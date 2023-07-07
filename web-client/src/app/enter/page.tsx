'use client';
import React, { useState, useEffect } from 'react';
import GoogleIcon from '@/components/Icons/Google';
import Twitter from '@/components/Icons/Twitter';
import { CgSpinner } from 'react-icons/cg';
import { BsTelephone } from 'react-icons/bs';
import { auth } from '@/config/firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
// @ts-ignore
import OtpInput from 'otp-input-react';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-hot-toast';
import 'react-phone-input-2/lib/style.css';

const Login: React.FC = () => {
  const [user, setUser] = useState<any>();
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');

  const onCaptchVerify = () => {
    console.log('onCaptchVerify');
    // @ts-ignore
    if (!window.recaptchaVerifier) {
      // @ts-ignore
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response: any) => {
            onSignup();
          },
          'expired-callback': () => {},
        },
        auth
      );
    }
  };

  const onOTPVerify = () => {
    console.log('onOTPVerify');
    setLoading(true);
    // @ts-ignore
    window.confirmationResult
      .confirm(otp)
      .then(async (res: any) => {
        console.log('res.user :>> ', res.user);
        setUser(res.user);
        setOtp('');
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  };

  const onSignup = () => {
    setLoading(true);
    onCaptchVerify();

    // @ts-ignore
    const appVerifier = window.recaptchaVerifier;
    const formatPhone: string = `+ ${phone}`;

    signInWithPhoneNumber(auth, formatPhone, appVerifier)
      .then((confirmationResult: any) => {
        // @ts-ignore
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success('OTP send successfully!');
      })
      .catch((error: any) => {
        console.log('error :>> ', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log('phone number :>> ', phone);
    console.log('otp :>> ', otp);
  }, [phone, otp]);

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
          <button className="btn-social bg-twitter-brand">
            <BsTelephone style={{ fill: 'white' }} />
            <span className="ml-2 text-white">Continue with phone</span>
          </button>
          <div>
            <div id="recaptcha-container"></div>
            {showOTP ? (
              <>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disable={false}
                  className="otp-container"
                  inputStyles={{ background: 'red' }}
                  autoFocus
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <PhoneInput
                  country="vn"
                  value={phone}
                  onChange={setPhone}
                ></PhoneInput>
                <button
                  onClick={onSignup}
                  className="bg-emerald-600 w-full mt-2 flex gap-1 items-center justify-center px-3 pr-5 py-3 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
            <button
              onClick={onSignup}
              className="bg-emerald-600 w-full mt-2 flex gap-1 items-center justify-center px-3 pr-5 py-3 text-white rounded"
            >
              {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
              <span>Sign in with phone</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
