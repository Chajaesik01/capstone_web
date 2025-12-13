import { AuthContext } from '@/constants/context';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import axios from 'axios';
import type { LoginType, UserInfoType } from '@/types/types';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});



// 요청 인터셉터, 토큰 자동 갱신
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    //const refreshToken = Cookies.get('refreshToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// accessToken 만료 (401에러)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    // 401 에러 + 원래 요청에 retry flag가 없다면
    if (error.response?.status === 401 && !request._retry) {
      request._retry = true;
      const refreshToken = Cookies.get('refreshToken');

      if (refreshToken) {
        try {
          // refreshToken으로 accessToken 갱신 요청
          const response = await apiClient.post(
            '/token/refresh',
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            }
          );

          const newAccessToken = response.data.accessToken;
          Cookies.set('accessToken', newAccessToken);

          // 갱신된 토큰으로 재시도
          request.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return apiClient(request);
        } catch (err) {
          // refreshToken도 만료된 경우, 로그아웃으로 처리
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const getUserInfo = async () => {
  const response = await apiClient.get('/user/info');
  return response.data;
};

export const api = {
  postLogin: async (user: LoginType) => {
    const response = await apiClient.post('/login', {
      username: user.email,
      password: user.password,
    });

    const accessToken = response.headers['authorization'];
    const refreshToken = response.headers['refresh-token'];

    return {
      message: response.data,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },

  postSignup: async (userData: UserInfoType) => {
    const response = await apiClient.post('/signup', {
      username: userData.email,
      password: userData.password,
      nickname: userData.nickname,
      type: userData.userType,
      carbon_emission: 500, // 임시 500으로 설정
      address: userData.address,
      bjd_code: userData.bjd_code
    });
    return response;
  },
};

export const useAuth = () => useContext(AuthContext);
