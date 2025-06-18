import type { UserInfoType } from '@/api/auth/api';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import { colors } from '@/styles';
import styled from 'styled-components';

const StyledMy = ({ user }: { user: UserInfoType }) => {
  return (
    <S.MyPageWrapper>
      <S.MyPageContainer>
        <S.MyPageBox>
          <S.MyPageTitle>기본정보 수정</S.MyPageTitle>
          <S.MyPageItem>
            <S.MyPageLabel>이메일</S.MyPageLabel>
            <S.MyPageInputSection>
              <Input value={user.email} />
            </S.MyPageInputSection>
          </S.MyPageItem>
          {user.userType === 'company' ? (
            <S.MyPageItem>
              <S.MyPageLabel>주소</S.MyPageLabel>
              <S.MyPageInputSection>
                <Input value={user.address} />
                <Button width="20">재등록</Button>
              </S.MyPageInputSection>
            </S.MyPageItem>
          ) : (
            <S.MyPageItem>
              <S.MyPageLabel>교통번호</S.MyPageLabel>
              <S.MyPageInputSection>
                <Input value={user.traffic_number} />
                <Button width="20">재등록</Button>
              </S.MyPageInputSection>
            </S.MyPageItem>
          )}
          <S.MyPageItem>
            <S.MyPageLabel>닉네임</S.MyPageLabel>
            <S.MyPageInputSection>
              <Input value={user.nickname} />
              <Button width="20">중복확인</Button>
            </S.MyPageInputSection>
          </S.MyPageItem>
          <S.MyPageItem>
            <S.MyPageLabel>전화번호</S.MyPageLabel>
            <S.MyPageInputSection>
              <Input />
            </S.MyPageInputSection>
          </S.MyPageItem>
          <S.MyPageTitle>비밀번호 재설정</S.MyPageTitle>
          <S.MyPageItem>
            <S.MyPageLabel>현재 비밀번호</S.MyPageLabel>
            <S.MyPageInputSection>
              <Input selectType="password" />
            </S.MyPageInputSection>
          </S.MyPageItem>
          <S.MyPageItem>
            <S.MyPageLabel>새 비밀번호</S.MyPageLabel>
            <S.MyPageInputSection>
              <Input selectType="password" />
            </S.MyPageInputSection>
          </S.MyPageItem>
          <S.MyPageItem>
            <S.MyPageLabel>새 비밀번호 확인</S.MyPageLabel>
            <S.MyPageInputSection>
              <Input selectType="password" />
            </S.MyPageInputSection>
          </S.MyPageItem>
          <S.MyPageBottom>
            <S.MyPageQuitButton>탈퇴하기</S.MyPageQuitButton>
            <S.MyPageRow>
              <S.MyPageResetButton>초기화</S.MyPageResetButton>
              <Button>저장</Button>
            </S.MyPageRow>
          </S.MyPageBottom>
        </S.MyPageBox>
      </S.MyPageContainer>
    </S.MyPageWrapper>
  );
};

const S = {
  MyPageWrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    min-height: 94vh;
    padding: 2vh 2vw;
    box-sizing: border-box;
  `,
  MyPageContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    width: 40vw;
    min-width: 320px;
    max-width: 600px;
    height: 90vh;
    border: 1px solid gray;
    padding: 2vh 2vw;
    box-sizing: border-box;
    overflow-y: auto;
  `,
  MyPageBox: styled.div`
    width: 100%;
    height: 100%;
    position: relative;
  `,
  MyPageTitle: styled.div`
    width: 100%;
    font-weight: 700;
    font-size: 1.4vw;
    min-font-size: 16px;
    border-bottom: 1px solid gray;
    padding-bottom: 1vh;
    margin-bottom: 3vh;

    @media (max-width: 768px) {
      font-size: 18px;
    }
  `,
  MyPageItem: styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    margin-bottom: 2vh;

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  `,
  MyPageLabel: styled.div`
    flex: 0 0 30%; // 기존 25% → 30%로 증가
    font-size: 1vw;
    min-width: 80px;
    max-width: 150px;
    font-weight: 500;
    color: #333;

    @media (max-width: 600px) {
      font-size: 14px;
      margin-bottom: 0.5vh;
    }
  `,
  MyPageInputSection: styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1vw;

    @media (max-width: 600px) {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
    }
  `,
  MyPageBottom: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2vh 0;
  `,
  MyPageRow: styled.div`
    display: flex;
    flex-direction: row;
    gap: 1vw;
    width: 40%;
    min-width: 140px;

    @media (max-width: 600px) {
      width: 50%;
    }
  `,
  MyPageQuitButton: styled.div`
    display: flex;
    width: 20%;
    min-width: 80px;
    height: 5vh;
    background-color: ${colors.semantic.warning};
    border-radius: 0.5vw;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-size: 1vw;
    font-weight: 500;

    &:hover {
      background-color: ${colors.semantic.hover.warning};
    }

    @media (max-width: 600px) {
      font-size: 14px;
    }
  `,
  MyPageResetButton: styled.div`
    flex: 1;
    min-width: 60px;
    height: 5vh;
    background-color: ${colors.semantic.secondary};
    border-radius: 0.5vw;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    display: flex;
    font-size: 1vw;
    font-weight: 500;

    &:hover {
      background-color: ${colors.semantic.hover.secondary};
    }

    @media (max-width: 600px) {
      font-size: 14px;
    }
  `,
};

export default StyledMy;
