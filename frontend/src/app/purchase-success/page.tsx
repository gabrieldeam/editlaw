"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import styles from './purchase-success.module.css';

const PurchaseSuccessPage: React.FC = () => {
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Limpar o carrinho
    clearCart();
  }, [clearCart]);

  return (
    <div className={styles.successContainer}>
      <h1>Compra realizada com sucesso!</h1>
      <p>Obrigado por sua compra.</p>
      <button onClick={() => router.push('/purchases')}>Ver minhas compras</button>
    </div>
  );
};

export default PurchaseSuccessPage;
