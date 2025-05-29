import styled from 'styled-components';
import Input from '@/components/common/input/Input';
import Button from '@/components/common/button/Button';

const StyledSignup = () => {
  return (
    <>
      <S.AuthFormItem>
        <p>이메일</p>
        <Input />
      </S.AuthFormItem>

      <S.AuthFormItem>
        <p>비밀번호</p>
        <Input selectType="password" />
      </S.AuthFormItem>

      <S.AuthFormItem>
        <S.AuthNameContainer>
          <p>닉네임</p>
          <Button width="20%" height="5vh" fSize="12px">
            중복확인
          </Button>
        </S.AuthNameContainer>
        <Input />
      </S.AuthFormItem>

      <S.AuthRow>
        <form>
          <p>회원 유형을 선택하세요</p>
          <S.RadioGroup>
            <S.RadioItem>
              <input
                type="radio"
                id="individual"
                name="select"
                value="individual"
              />
              <label htmlFor="individual">개인</label>
            </S.RadioItem>

            <S.RadioItem>
              <input type="radio" id="company" name="select" value="company" />
              <label htmlFor="company">기업</label>
            </S.RadioItem>
          </S.RadioGroup>
        </form>
      </S.AuthRow>
      <S.AuthFormItem>
        <Button>등록</Button>
      </S.AuthFormItem>
    </>
  );
};

const S = {
  AuthFormItem: styled.div`
    width: 80%;

    p {
      margin-bottom: 1vh;
    }
  `,

  AuthRow: styled.div`
    width: 80%;
    margin-bottom: 20px;
    text-align: center;
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
};

export default StyledSignup;
