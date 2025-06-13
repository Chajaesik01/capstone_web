import { colors } from '@/styles';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ROUTER_PATH } from '@/constants/constansts';
import LogoutButton from '@/components/common/button/LogoutButton';
import { getUserDB, getUserId } from '@/api/api';
import { useState, useEffect } from 'react';

type StyledNavigationProps = {
  currentPath: string;
};

const StyledNavigation = ({ currentPath }: StyledNavigationProps) => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userId = getUserId();

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const data = await getUserDB(userId);
          setUserData(data);
        } catch (error) {
          console.error('사용자 데이터 가져오기 실패:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const type = userData?.userType === 'company' ? '기업회원' : '개인회원';
  const nickname = userData?.nickname || '사용자';

  const isDashboardActive = currentPath === ROUTER_PATH.DASHBOARD;
  const isMypageActive = currentPath === ROUTER_PATH.MYPAGE;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <S.NavigationContainer>
      <S.NavigationLogo>Logo</S.NavigationLogo>

      <S.NavigationSelect>
        <S.NavigationItem
          $isActive={isDashboardActive}
          onClick={() => handleNavigate(ROUTER_PATH.DASHBOARD)}
        >
          대시보드
        </S.NavigationItem>

        <S.NavigationItem
          $isActive={isMypageActive}
          onClick={() => handleNavigate(ROUTER_PATH.MYPAGE)}
        >
          마이페이지
        </S.NavigationItem>
        <S.NavigationInfo>
          {nickname}({type})
        </S.NavigationInfo>
        <LogoutButton />
      </S.NavigationSelect>
    </S.NavigationContainer>
  );
};

const S = {
  NavigationContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
    height: 6vh;
    background-color: ${colors.semantic.primary};
    padding: 0 10px;
  `,

  NavigationLogo: styled.div`
    width: auto;
    height: auto;
    background-color: blue;
    padding: 10px;
    color: white;
  `,

  NavigationSelect: styled.div`
    display: flex;
    flex-direction: row;
    width: 30%;
    height: 80%;
    color: white;
    padding: 10px;
    text-align: center;
    gap: 5%;
  `,

  NavigationInfo: styled.div`
    width: 30%;
  `,

  NavigationItem: styled.div<{ $isActive: boolean }>`
    width: 30%;
    height: auto;
    cursor: pointer;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    background-color: ${({ $isActive }) =>
      $isActive ? colors.semantic.hover.primary : 'transparent'};
    color: ${({ $isActive }) => ($isActive ? 'black' : 'white')};
    font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};

    &:hover {
      background-color: ${colors.semantic.hover.primary};
      color: black;
    }
  `,
};

export default StyledNavigation;
