import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import styled from 'styled-components';

const StyledLogin = () => {
  return (
    <S.AuthFormWrapper>
      <S.AuthFormItem>
        <p>이메일</p>
        <Input />
      </S.AuthFormItem>

      <S.AuthFormItem>
        <p>비밀번호</p>
        <Input selectType="password" />
      </S.AuthFormItem>

      <S.AuthFormRowItem>
        <p>아이디/비밀번호 찾기</p>
        <p>회원가입</p>
      </S.AuthFormRowItem>
      <Button height="6vh">로그인</Button>
    </S.AuthFormWrapper>
  );
};

const S = {
  AuthFormWrapper: styled.div`
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5vh;
  `,

  AuthFormItem: styled.div`
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
