// src/utils/passwordValidation.ts

export const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres.";
    }
    if (/\s/.test(password)) {
      return "A senha não deve conter espaços.";
    }
    if (!/\d/.test(password)) {
      return "A senha deve conter pelo menos um número.";
    }
    if (!/[A-Z]/.test(password)) {
      return "A senha deve conter pelo menos uma letra maiúscula.";
    }
    return null; // Retorna null se a senha for válida
  };
  