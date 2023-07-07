import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDxdXJxrjCUYtVYoIN1n_td4LbSkMXzyJU',
  authDomain: 'dev-blog-8b88f.firebaseapp.com',
  projectId: 'dev-blog-8b88f',
  storageBucket: 'dev-blog-8b88f.appspot.com',
  messagingSenderId: '798388498984',
  appId: '1:798388498984:web:8cc87b2283de31dba13b1d',
  measurementId: 'G-YN760ZC6E8',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
