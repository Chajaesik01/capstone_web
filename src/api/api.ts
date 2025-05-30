import { AuthContext } from '@/constants/context';
import { get, getDatabase, ref, set } from 'firebase/database';
import { useContext } from 'react';

type saveToUserType = {
  userId: string;
  userData: {
    userId: string;
    email: string;
    password: string;
    nickname: string;
    userType: string;
  };
};

export const saveToUserDB = async ({ userId, userData }: saveToUserType) => {
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

export const useAuth = () => useContext(AuthContext);
