import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório.')
    .email('Informe um email válido.'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória.')
    .min(6, 'A senha deve ter ao menos 6 caracteres.'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório.')
      .min(2, 'O nome deve ter ao menos 2 caracteres.'),
    email: z
      .string()
      .min(1, 'Email é obrigatório.')
      .email('Informe um email válido.'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória.')
      .min(6, 'A senha deve ter ao menos 6 caracteres.'),
    confirmPassword: z
      .string()
      .min(1, 'Confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
