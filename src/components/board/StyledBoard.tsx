import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import styled from 'styled-components';
// createPost와 deletePost 함수를 추가로 import 합니다.
import { getPosts, createPost, deletePost } from '@/api/board/api'; 
import type { Post } from '@/api/board/api';

const StyledBoard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 1. 새 게시글의 제목과 내용을 위한 state 추가
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');

  // 데이터를 불러오는 함수를 분리하여 재사용성을 높입니다.
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts();
      setPosts(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e);
        console.error("게시글을 불러오는데 실패했습니다:", e);
      } else {
        setError(new Error('알 수 없는 에러가 발생했습니다.'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 2. 게시글 생성 핸들러
  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault(); // form의 기본 제출 동작 방지
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await createPost({ title: newPostTitle, content: newPostContent });
      setNewPostTitle(''); // 입력 필드 초기화
      setNewPostContent('');
      await fetchPosts(); // 게시글 목록 새로고침
    } catch (err) {
      console.error('게시글 생성에 실패했습니다:', err);
      alert('게시글 생성에 실패했습니다.');
    }
  };

  // 3. 게시글 삭제 핸들러
  const handleDeletePost = async (id: number) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost(id);
        // UI에서 즉시 삭제된 것처럼 보이도록 state를 업데이트
        setPosts(posts.filter(post => post.id !== id));
      } catch (err) {
        console.error('게시글 삭제에 실패했습니다:', err);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <S.BoardWrapper><div>로딩 중...</div></S.BoardWrapper>;
  }

  if (error) {
    return <S.BoardWrapper><div>에러가 발생했습니다: {error.message}</div></S.BoardWrapper>;
  }

  return (
    <S.BoardWrapper>
      <S.BoardContainer>
        <S.BoardTitle>자유 게시판</S.BoardTitle>

        {/* --- 게시글 생성 UI --- */}
        <S.FormContainer onSubmit={handleCreatePost}>
          <S.Input
            type="text"
            placeholder="제목"
            value={newPostTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPostTitle(e.target.value)}
          />
          <S.Textarea
            placeholder="내용"
            value={newPostContent}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewPostContent(e.target.value)}
          />
          <S.SubmitButton type="submit">등록</S.SubmitButton>
        </S.FormContainer>

        {/* --- 게시글 목록 UI --- */}
        <S.PostList>
          {posts.length > 0 ? (
            posts.map((post) => (
              <S.PostItem key={post.id}>
                <S.PostContent>
                  <span>{post.title}</span>
                  <span>{post.authorNickname}</span>
                </S.PostContent>
                {/* --- 삭제 버튼 --- */}
                <S.DeleteButton onClick={() => handleDeletePost(post.id)}>삭제</S.DeleteButton>
              </S.PostItem>
            ))
          ) : (
            <S.PostItem>게시글이 없습니다.</S.PostItem>
          )}
        </S.PostList>
      </S.BoardContainer>
    </S.BoardWrapper>
  );
};

// 4. 추가된 UI를 위한 스타일 정의
const S = {
  // ... (기존 BoardWrapper, BoardContainer, BoardTitle, PostList는 동일)
  BoardWrapper: styled.div`...`,
  BoardContainer: styled.div`...`,
  BoardTitle: styled.h1`...`,
  PostList: styled.ul`...`,

  // --- 추가된 스타일 ---
  FormContainer: styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
  `,
  Input: styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  `,
  Textarea: styled.textarea`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    min-height: 80px;
    resize: vertical;
  `,
  SubmitButton: styled.button`
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    align-self: flex-end; /* 버튼을 오른쪽으로 정렬 */

    &:hover {
      background-color: #0056b3;
    }
  `,
  PostItem: styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center; /* 수직 중앙 정렬 */
    padding: 15px 10px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  `,
  PostContent: styled.div`
    display: flex;
    flex-direction: column; /* 제목과 작성자를 세로로 배치 */
    gap: 5px;

    span:first-child {
      font-size: 16px;
      font-weight: 500;
    }
    span:last-child {
      font-size: 14px;
      color: #888;
    }
  `,
  DeleteButton: styled.button`
    padding: 5px 10px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #c82333;
    }
  `,
};

export default StyledBoard;