import { AuthContext } from '@/constants/context';
import { database } from '@/firebase-config';
import { get, getDatabase, ref, set } from 'firebase/database';
import Cookies from 'js-cookie';
import { useContext } from 'react';

export type UserType = {
  userId: string;
  userData: {
    userId: string;
    email: string;
    password: string;
    nickname: string;
    userType: string;
  };
};

export type UserInfoType = {
  userId: string;
  email: string;
  password: string;
  nickname: string;
  userType: string;
  address: string;
  traffic_number: string;
};

export const saveToUserDB = async ({ userId, userData }: UserType) => {
  try {
    const db = getDatabase();
    await set(ref(db, `Users/${userId}`), userData);
  } catch (error: unknown) {
    console.log('회원 정보 저장 중 에러 ', error);
  }
};

export const checkUserDB = async (userId: string) => {
  try {
    const db = getDatabase();
    const result = await get(ref(db, `Users/${userId}`));
    console.log('result : ', result);
    return result;
  } catch (error: unknown) {
    console.log('회원 체크 중 에러 ', error);
  }
};

export const getUserDB = async (userId: string) => {
  const userRef = ref(database, `Users/${userId}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const userData = snapshot.val();
    return userData;
  }
};

export const getUserId = () => {
  return Cookies.get('userId') || '';
};

export const useAuth = () => useContext(AuthContext);

