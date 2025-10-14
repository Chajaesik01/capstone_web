import { apiClient } from "../auth/api";


export const getAiSuggestion = async (): Promise<string> => {
  // interceptor가 헤더를 자동으로 추가해주므로, 그냥 GET 요청만 보내면 됩니다.
  const response = await apiClient.get<string>('/ai/suggestions');
  return response.data;
};