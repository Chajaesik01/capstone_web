import { apiClient } from "../auth/api";

export interface Post {
  id: number;
  title: string;
  content: string;
  authorNickname: string;
}

// 백엔드의 PostRequestDto와 일치하는 타입
export interface PostRequestBody {
  title: string;
  content: string;
}


export const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>('/posts');
  return response.data;
};

/**
 * 새로운 게시글을 생성하는 API
 * POST /api/posts
 * @param {PostRequestBody} postData - { title, content }
 * @returns {Promise<string>} 성공 메시지를 반환
 */
export const createPost = async (postData: PostRequestBody): Promise<string> => {
  const response = await apiClient.post<string>('/posts', postData);
  return response.data;
};

/**
 * 특정 게시글을 수정하는 API
 * PUT /api/posts/{id}
 * @param {number} id - 수정할 게시글의 ID
 * @param {PostRequestBody} postData - { title, content }
 * @returns {Promise<Post>} 수정된 Post 객체를 반환
 */
export const updatePost = async (id: number, postData: PostRequestBody): Promise<Post> => {
    const response = await apiClient.put<Post>(`/posts/${id}`, postData);
    return response.data;
};

/**
 * 특정 게시글을 삭제하는 API
 * DELETE /api/posts/{id}
 * @param {number} id - 삭제할 게시글의 ID
 * @returns {Promise<string>} 성공 메시지를 반환
 */
export const deletePost = async (id: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/posts/${id}`);
    return response.data;
};