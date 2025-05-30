import { z } from 'zod';

export const SignupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .email('올바른 이메일 형식을 입력해주세요'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .regex(/[^A-Za-z0-9]/, '특수문자를 최소 1개 포함해야 합니다'),
    confirmPassword: z.string(),
    nickname: z
      .string()
      .min(2, '닉네임은 최소 2자 이상이어야 합니다')
      .max(10, '닉네임은 최대 10자까지 가능합니다'),
    userType: z.enum(['individual', 'company'], {
      required_error: '회원 유형을 선택해주세요',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/[^A-Za-z0-9]/, '특수문자를 최소 1개 포함해야 합니다'),
});
