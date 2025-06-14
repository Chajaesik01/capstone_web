import type { UserInfoType } from '@/api/api';
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
    width: 100%;
    height: 94vh;
  `,
  MyPageContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    width: 40%;
    height: 90%;
    border: 1px solid gray;
    padding: 30px;
  `,
  MyPageBox: styled.div`
    width: 100%;
    height: 100%;
    position: relative;
  `,
  MyPageTitle: styled.div`
    width: 100%;
    height: auto;
    font-weight: 700;
    font-size: 18px;
    border-bottom: 1px solid gray;
    padding-bottom: 15px;
    margin-bottom: 30px;
  `,
  MyPageItem: styled.div`
    display: flex;
    width: 100%;
    height: auto;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  `,
  MyPageLabel: styled.div`
    width: 25%;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  `,
  MyPageInputSection: styled.div`
    display: flex;
    width: 75%;
    align-items: center;
    gap: 10px;
  `,
  MyPageBottom: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px 0;
  `,
  MyPageRow: styled.div`
    display: flex;
    width: 30%;
    flex-direction: row;
    gap: 10px;
  `,
  MyPageQuitButton: styled.div`
    display: flex;
    width: 15%;
    height: 40px;
    background-color: ${colors.semantic.warning};
    border-radius: 8px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      background-color: ${colors.semantic.hover.warning};
    }
  `,
  MyPageResetButton: styled.div`
    display: flex;
    width: 100%;
    height: 40px;
    background-color: ${colors.semantic.secondary};
    border-radius: 8px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      background-color: ${colors.semantic.hover.secondary};
    }
  `,
};

export default StyledMy;
