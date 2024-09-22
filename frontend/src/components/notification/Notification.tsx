import React, { useState } from 'react';
import styles from './Notification.module.css';

interface NotificationProps {
  message: string;
  type: 'success' | 'error'; // Define o tipo de notificação
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const [visible, setVisible] = useState(true); // Estado para controlar a visibilidade da notificação

  const iconSrc = type === 'success' ? '/icon/success.svg' : '/icon/error.svg'; // Escolhe o ícone
  const iconAlt = type === 'success' ? 'Sucesso' : 'Erro';

  // Função para fechar a notificação
  const handleClose = () => {
    setVisible(false);
  };

  // Se a notificação não estiver visível, não renderizar nada
  if (!visible) return null;

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <img src={iconSrc} alt={iconAlt} className={styles.icon} />
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={handleClose}>×</button> {/* Botão de fechar */}
    </div>
  );
};

export default Notification;
