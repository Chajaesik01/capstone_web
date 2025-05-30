import { getDatabase, ref, set } from 'firebase/database';

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
