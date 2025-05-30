import type { AuthProps } from '@/types/types';
import StyledSignup from './StyledSignup';

const Signup = ({ onSwitch }: AuthProps) => {
  return <StyledSignup onSwitch={onSwitch} />;
};

export default Signup;
