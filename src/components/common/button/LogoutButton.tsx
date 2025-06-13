import { colors } from '@/styles';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('userId');
    navigate('/auth');
  };

  return (
    <S.LogoutButtnContainer onClick={handleLogout}>
      로그아웃
    </S.LogoutButtnContainer>
  );
};

const S = {
  LogoutButtnContainer: styled.div`
    width: 15%;
    height: auto;

    cursor: pointer;
    background-color: ${colors.scale.info};
    &:hover {
      background-color: ${colors.semantic.hover.primary};
      color: black;
    }
  `,
};
export default LogoutButton;
