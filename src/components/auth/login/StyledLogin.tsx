import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import styled from 'styled-components';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Controller, useForm } from 'react-hook-form';
import { LoginSchema } from '@/schema/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AuthProps } from '@/types/types';
import { useNavigate } from 'react-router-dom';

type LoginType = {
  email: string;
  password: string;
};

const StyledLogin = ({ onSwitch }: AuthProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    //watch,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LoginType) => {
    try {
      const auth = getAuth();
      const login = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(login);
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('로그인 에러', error);
    }
  };

  const handleMove = () => {
    onSwitch();
  };

  return (
    <S.AuthFormWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <S.AuthFormItem $hasError={!!errors.email}>
          <p>이메일</p>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                selectType="email"
                placeholder="이메일을 입력하세요"
                value={field.value}
                onChange={field.onChange}
                error={errors.email}
                name="email"
                id="email"
                height="100%"
              />
            )}
          />
        </S.AuthFormItem>

        <S.AuthFormItem $hasError={!!errors.password}>
          <p>비밀번호</p>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                selectType="password"
                placeholder="비밀번호를 입력하세요"
                value={field.value}
                onChange={field.onChange}
                error={errors.password}
                name="password"
                id="password"
                height="100%"
              />
            )}
          />
        </S.AuthFormItem>

        <S.AuthFormRowItem>
          <p>아이디/비밀번호 찾기</p>
          <p onClick={handleMove}>회원가입</p>
        </S.AuthFormRowItem>
        <Button type="submit" height="6vh">
          로그인
        </Button>
      </form>
    </S.AuthFormWrapper>
  );
};

const S = {
  AuthFormWrapper: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5vh;

    form {
      width: 60%;
      display: flex;
      flex-direction: column;
      gap: 2.5vh;
    }
  `,

  AuthFormItem: styled.div<{ $hasError?: boolean }>`
    width: 100%;
    display: flex;
    flex-direction: column;

    p {
      margin-bottom: 1vh;
      width: 100%;
      text-align: left;
    }
  `,

  AuthFormRowItem: styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    p {
      margin: 0;
      color: gray;

      &:hover {
        color: black;
        cursor: pointer;
      }
    }
  `,
};

export default StyledLogin;
