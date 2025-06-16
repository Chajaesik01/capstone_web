import { colors } from '@/styles';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ROUTER_PATH } from '@/constants/constansts';
import LogoutButton from '@/components/common/button/LogoutButton';
import { useUserStore } from '@/hooks/auth/auth';

type StyledNavigationProps = {
  currentPath: string;
};

const StyledNavigation = ({ currentPath }: StyledNavigationProps) => {
  const navigate = useNavigate();

  const { user, isLoading, isAuthenticated, error } = useUserStore();
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;
  if (!isAuthenticated) return <div>로그인이 필요합니다</div>;

  const type = user.userType === 'company' ? '기업회원' : '개인회원';
  const nickname = user.nickname || '사용자';

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
