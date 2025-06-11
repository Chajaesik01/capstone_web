import styled from 'styled-components';
import Input from '@/components/common/input/Input';
import Button from '@/components/common/button/Button';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema } from '@/schema/schema';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { saveToUserDB } from '@/api/api';
import type { AuthProps } from '@/types/types';
import DaumPost, { type AddressObj } from '@/api/kakao/DaumPost';
import { useState } from 'react';

type FormType = {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  userType: string;
  cardNumber?: string;
};

const StyledSignup = ({ onSwitch }: AuthProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      userType: undefined,
    },
  });

  const [addressTrigger, setAddressTrigger] = useState<boolean>(false);
  const userType = watch('userType');
  const [addressObj, setAddressObj] = useState<AddressObj>({
    areaAddress: '',
    townAddress: '',
  });

  const onSubmit = async (data: FormType) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await saveToUserDB({
        userId: userCredential.user.uid,
        userData: {
          userId: userCredential.user.uid,
          email: data.email,
          password: '',
          nickname: data.nickname,
          userType: data.userType,
          ...(data.userType === 'company' && {
            address: addressObj.areaAddress + addressObj.townAddress,
          }),
          ...(data.userType === 'individual' && {
            cardNumber: 'cardNumber',
          }),
        },
      });

      alert('회원가입이 완료되었습니다!');
      onSwitch();
    } catch (error) {
      console.error('회원가입 에러:', error);
    }
  };

  const handleNicknameCheck = async () => {
    const nickname = watch('nickname');
    if (!nickname) {
      alert('닉네임을 입력해주세요');
      return;
    }

    try {
      alert('사용 가능한 닉네임입니다!');
    } catch (error) {
      console.log(error);
      alert('이미 사용 중인 닉네임입니다.');
    }
  };

  const handleAddressUpdate = (obj: AddressObj) => {
    setAddressObj(obj);
  };

  return (
    <S.FormContainer>
      {userType === 'company' && (
        <DaumPost
          setAddressObj={handleAddressUpdate}
          trigger={addressTrigger}
        />
      )}
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
              />
            )}
          />
        </S.AuthFormItem>

        <S.AuthFormItem $hasError={!!errors.confirmPassword}>
          <p>비밀번호 확인</p>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                selectType="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={field.value}
                onChange={field.onChange}
                error={errors.confirmPassword}
                name="confirmPassword"
                id="confirmPassword"
              />
            )}
          />
        </S.AuthFormItem>

        <S.AuthFormItem $hasError={!!errors.nickname}>
          <S.AuthNameContainer>
            <p>닉네임</p>
            <Button
              width="20%"
              height="5vh"
              fSize="12px"
              onClick={handleNicknameCheck}
            >
              중복확인
            </Button>
          </S.AuthNameContainer>
          <Controller
            name="nickname"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="닉네임을 입력하세요"
                value={field.value}
                onChange={field.onChange}
                error={errors.nickname}
                name="nickname"
                id="nickname"
              />
            )}
          />
        </S.AuthFormItem>

        <S.AuthRow>
          <div>
            <p>회원 유형을 선택하세요</p>
            <S.RadioGroup>
              <S.RadioItem>
                <Controller
                  name="userType"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="radio"
                      id="individual"
                      value="individual"
                      checked={field.value === 'individual'}
                      onChange={() => field.onChange('individual')}
                    />
                  )}
                />
                <label htmlFor="individual">개인</label>
              </S.RadioItem>
              <S.RadioItem>
                <Controller
                  name="userType"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="radio"
                      id="company"
                      value="company"
                      checked={field.value === 'company'}
                      onChange={() => {
                        field.onChange('company');
                        setAddressTrigger(true);
                      }}
                    />
                  )}
                />
                <label htmlFor="company">기업</label>
              </S.RadioItem>
            </S.RadioGroup>
            {errors.userType && (
              <S.ErrorMessageCenter>
                ⚠️ {errors.userType.message}
              </S.ErrorMessageCenter>
            )}
          </div>
        </S.AuthRow>

        <S.AuthNomalRow>
          {addressObj ? (
            <p>
              {addressObj.areaAddress}
              {addressObj.townAddress}
            </p>
          ) : (
            ''
          )}
        </S.AuthNomalRow>

        <S.AuthFormItem>
          <Button type="submit">등록</Button>
        </S.AuthFormItem>
      </form>
    </S.FormContainer>
  );
};

const S = {
  FormContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
  `,

  AuthFormItem: styled.div<{ $hasError?: boolean }>`
    width: 75%;
    margin-bottom: ${(props) => (props.$hasError ? '0' : '20px')};

    p {
      margin-bottom: 1vh;
      text-align: left;
    }
  `,

  AuthRow: styled.div`
    width: 100%;
    text-align: center;
  `,
  AuthNomalRow: styled.div`
    width: 100%;
    text-align: center;
    margin: 1vh 0;
  `,

  AuthNameContainer: styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1vh;
  `,

  RadioGroup: styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
    cursor: pointer;
  `,

  RadioItem: styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
  `,

  ErrorMessage: styled.div`
    color: #e74c3c;
    font-size: 12px;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 400;
    line-height: 1.4;
  `,

  ErrorMessageCenter: styled.span`
    color: #ef4444;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: cetner;
    margin-bottom: 0;
  `,
};

export default StyledSignup;
