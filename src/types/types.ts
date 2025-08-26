// 로그인 관련 type들
export type LoginType = {
  email: string;
  password: string;
};

export type UserType = {
  email: string;
  password: string;
  nickname: string;
  userType: string;
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

export type AuthProps = {
  onSwitch: () => void;
};

export type AuthContextType = {
  accessToken: string | undefined;
  setAccessToken: (id: string | undefined) => void;
};

export type CarbonAnalysisResult = {
  [bunji: string]: {
    [year: string]: {
      totalCarbon: number;
      totalElectricity: number;
      avgCarbon: number;
      avgElectricity: number;
      maxCarbon: number;
      minCarbon: number;
      monthCount: number;
    };
  };
};
