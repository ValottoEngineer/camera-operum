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

export const updateNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório.')
    .min(2, 'O nome deve ter ao menos 2 caracteres.'),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Senha atual é obrigatória.'),
    newPassword: z
      .string()
      .min(1, 'Nova senha é obrigatória.')
      .min(6, 'A nova senha deve ter ao menos 6 caracteres.'),
    confirmNewPassword: z
      .string()
      .min(1, 'Confirmação da nova senha é obrigatória.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As novas senhas não coincidem.',
    path: ['confirmNewPassword'],
  });

export const simulatorSchema = z.object({
  initialAmount: z.number().min(100, 'Valor mínimo: R$ 100').max(1000000, 'Valor máximo: R$ 1.000.000'),
  monthlyContribution: z.number().min(0, 'Aporte não pode ser negativo').max(100000, 'Aporte máximo: R$ 100.000'),
  period: z.number().min(1, 'Período mínimo: 1 ano').max(30, 'Período máximo: 30 anos'),
  selectedStocks: z.array(z.string()).min(1, 'Selecione pelo menos uma ação'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateNameFormData = z.infer<typeof updateNameSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type SimulatorFormData = z.infer<typeof simulatorSchema>;
