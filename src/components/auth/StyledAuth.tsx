import styled from 'styled-components';
import loginImg from '@/assets/login/login_img.svg';
import Signup from '@/components/auth/signup/Signup';
//import { useState } from 'react'
import Login from '@/components/auth//login/Login';

const StyledAuth = () => {
  //const [isSignup, setIsSignup] = useState(true);
  const isSignup = true;

  return (
    <S.AuthWrapper>
      <S.AuthContainer>
        <S.AuthImgContainer>
          <img src={loginImg} alt="loginImg" />
        </S.AuthImgContainer>
        <S.AuthFormContainer>
          {isSignup ? <Signup /> : <Login />}
        </S.AuthFormContainer>
      </S.AuthContainer>
    </S.AuthWrapper>
  );
};

const S = {
  AuthWrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
  `,
  AuthContainer: styled.div`
    display: flex;
    width: 80%;
    height: 80%;
  `,

  AuthImgContainer: styled.div`
    width: 50%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
  AuthFormContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    flex-direction: column;
    border: 0.5px solid gray;
    padding: 20px;
    gap: 2vh;
  `,
};

export default StyledAuth;
