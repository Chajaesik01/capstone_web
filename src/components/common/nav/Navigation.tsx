import StyledNavigation from '@/components/common/nav/StyledNavigation';
import { useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return <StyledNavigation currentPath={currentPath} />;
};

export default Navigation;
