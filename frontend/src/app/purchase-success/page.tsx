"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import styles from './purchase-success.module.css';
import Image from 'next/image';

const PurchaseSuccessPage: React.FC = () => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [confettiActive, setConfettiActive] = useState(true);

  useEffect(() => {
    // Desativa o confete após 5 segundos
    const timer = setTimeout(() => {
      setConfettiActive(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.successContainer}>
      {confettiActive && <Confetti width={width} height={height} />}
      <div className={styles.content}>
      <div className={styles.imageContainer}>
          <Image src="/icon/checklogo.svg" alt="Sucesso" width={150} height={150} />
        </div>
        <h1 className={styles.title}>Compra Realizada com Sucesso!</h1>
        <p className={styles.paragraph}>Obrigado por sua compra. Seu pedido está sendo processado.</p>
        <button onClick={() => router.push('/purchases')} className={styles.button}>
          Ver Minhas Compras
        </button>
      </div>
      <div className={styles.footer}>
        <p>Se precisar de ajuda, entre em contato conosco.</p>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
