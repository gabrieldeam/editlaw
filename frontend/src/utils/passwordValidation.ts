// src/utils/passwordValidation.ts

export const validatePassword = (password: string): string | null => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[^\s]{8,}$/;
  if (!passwordRegex.test(password)) {
    return 'A senha deve conter pelo menos 8 caracteres, sem espaços, com pelo menos um número, uma letra maiúscula e um caractere especial.';
  }
  return null;
};
