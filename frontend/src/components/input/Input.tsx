import React, { useState } from 'react';
import styles from './Input.module.css';

interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, name, placeholder, type = 'text' }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const isPasswordInput = type === 'password';

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={name}
          name={name}
          type={isPasswordInput && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
        />
        {isPasswordInput && (
          <img
            src={showPassword ? '/icon/closedeye.svg' : '/icon/eye.svg'}
            alt={showPassword ? 'Esconder senha' : 'Mostrar senha'}
            className={styles.toggleIcon}
            onClick={handleTogglePassword}
          />
        )}
      </div>
    </div>
  );
};

export default Input;