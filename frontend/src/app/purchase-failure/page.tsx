"use client";
import { useRouter } from 'next/navigation';
import styles from './purchase-failure.module.css';

const PurchaseFailurePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.failureContainer}>
      <h1>Pagamento não aprovado</h1>
      <p>Ocorreu um problema com seu pagamento.</p>
      <button onClick={() => router.push('/cart/payment')}>Tentar novamente</button>
      <button onClick={() => router.push('/purchases')}>Ver minhas compras</button>
    </div>
  );
};

export default PurchaseFailurePage;
