import type { AuthProps } from '@/types/types';
import StyledLogin from './StyledLogin';

const Login = ({ onSwitch }: AuthProps) => {
  return <StyledLogin onSwitch={onSwitch} />;
};

export default Login;
