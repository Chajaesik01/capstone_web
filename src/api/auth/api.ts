import { AuthContext } from '@/constants/context';
import { database } from '@/firebase-config';
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

  } catch (error: unknown) {
    console.log('회원 정보 저장 중 에러 ', error);
  }
};

export const checkUserDB = async (userId: string) => {
  try {
    console.log('result : ', result);
    return result;
  } catch (error: unknown) {
    console.log('회원 체크 중 에러 ', error);
  }
};

export const getUserDB = async (userId: string) => {


    return userData;
  }
};

export const getUserId = () => {
  return Cookies.get('userId') || '';
};

export const useAuth = () => useContext(AuthContext);

