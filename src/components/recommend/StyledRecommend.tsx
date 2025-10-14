import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { getAiSuggestion } from '@/api/ai/api'; // API 함수 경로는 확인해주세요.

const StyledRecommend = () => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // 페이지 로드 시 바로 로딩 시작
  const [error, setError] = useState<string | null>(null);

  // 페이지가 처음 렌더링될 때 API를 호출하기 위해 useEffect 사용
  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAiSuggestion();
        setSuggestion(result);
      } catch (err) {
        setError('제안을 받아오는 데 실패했어요. 잠시 후 다시 시도해 주세요.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, []); // 빈 배열을 전달하여 최초 한 번만 실행되도록 설정

  return (
    <S.PageWrapper>
      <S.RecommendContainer>
        <S.Icon>🌍</S.Icon>
        <S.Title>AI가 제안하는 오늘의 탄소 절감 방법!</S.Title>
        <S.Description>
          당신의 활동 데이터를 기반으로 AI가 맞춤형 탄소 절감 방안을 생성하고 있어요.
        </S.Description>

        <S.ResultArea>
          {loading && (
            <>
              <S.LoadingSpinner />
              <S.LoadingText>AI가 생각 중...</S.LoadingText>
            </>
          )}
          {error && <S.ErrorText>{error}</S.ErrorText>}
          
          {/* 로딩이 끝나고, 에러가 없으면 제안을 표시 */}
          {!loading && !error && suggestion && (
            <S.ResultBox>{suggestion}</S.ResultBox>
          )}
        </S.ResultArea>
      </S.RecommendContainer>
    </S.PageWrapper>
  );
};

export default StyledRecommend;

// --- Styled Components (기존 스타일과 거의 동일) ---
const S: { [key: string]: any } = {};

S.PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa, #d4f0f0);
  padding: 20px;
`;

S.RecommendContainer = styled.div`
  max-width: 650px;
  width: 100%;
  padding: 40px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

S.Icon = styled.div`
  font-size: 50px;
  margin-bottom: 20px;
`;

S.Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 15px;
`;

S.Description = styled.p`
  font-size: 16px;
  color: #5d6d7e;
  margin-bottom: 30px;
  line-height: 1.6;
  max-width: 500px;
`;

S.ResultArea = styled.div`
  width: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column; // 로딩 스피너와 텍스트를 세로로 배치
  align-items: center;
  justify-content: center;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

S.LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2ecc71;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

S.LoadingText = styled.p`
  margin-top: 15px;
  font-size: 16px;
  color: #5d6d7e;
`;

S.ResultBox = styled.div`
  padding: 25px;
  background-color: #f8f9fa;
  border-radius: 15px;
  border: 1px solid #e9ecef;
  text-align: left;
  line-height: 1.8;
  color: #34495e;
  width: 100%;
  font-size: 16px;
  white-space: pre-wrap; // 줄바꿈과 공백을 그대로 표시
`;

S.ErrorText = styled.p`
  color: #e74c3c;
  font-size: 15px;
`;