import StyledMy from '@/components/mypage/StyledMy';
import { useUserStore } from '@/hooks/auth/auth';

const My = () => {
  const { user, isLoading, isAuthenticated, error } = useUserStore();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;
  if (!isAuthenticated) return <div>로그인이 필요합니다</div>;

  console.log(user);
  return <StyledMy user={user} />;
};

export default My;
