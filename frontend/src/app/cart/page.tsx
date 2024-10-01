"use client";

import { useEffect, useState } from 'react';
import { getDocumentById, DocumentData } from '@/services/documentApi';
import { getActiveCouponByName } from '@/services/couponService';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation'; 
import { usePayment } from '../../context/PaymentContext'; // Importa o contexto de pagamento
import Notification from '../../components/notification/Notification';
import styles from './cart.module.css';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart } = useCart();
  const { setTotalAmount } = usePayment(); // Usa o contexto de pagamento
  const router = useRouter(); // Para redirecionar o usuário
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>(''); // Código promocional
  const [discount, setDiscount] = useState<number>(0); // Estado para armazenar o valor do desconto
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Buscar detalhes de cada documento no carrinho
    const fetchDocuments = async () => {
      const docs: DocumentData[] = [];
      let total = 0;

      for (const itemId of cartItems) {
        const document = await getDocumentById(itemId);
        docs.push(document);

        // Calcular subtotal
        total += document.precoDesconto ? document.precoDesconto : document.preco;
      }

      setDocuments(docs);
      setSubtotal(total);
    };

    if (cartItems.length > 0) {
      fetchDocuments();
    }
  }, [cartItems]);

  const handleRemoveItem = (documentId: string) => {
    removeFromCart(documentId);
  };

  const handleApplyPromoCode = async () => {
    try {
      const response = await getActiveCouponByName(promoCode);
      
      if ('discountRate' in response) {
        const discountRate = response.discountRate;
        const discountAmount = (subtotal * discountRate) / 100; // Calcular o desconto

        setDiscount(discountAmount); // Atualiza o desconto
        setNotification({ message: `Código promocional aplicado com sucesso! Desconto de ${discountRate}%`, type: 'success' });
      } else {
        setNotification({ message: response.message, type: 'error' });
        setDiscount(0); // Se o código for inválido, remove o desconto
      }
    } catch (error) {
      setNotification({ message: 'Erro ao aplicar o código promocional.', type: 'error' });
    }
  };

  const handlePayment = () => {
    const totalAmount = subtotal - discount;
    setTotalAmount(totalAmount); // Armazena o total no contexto
    router.push('/cart/payment'); // Redireciona para a página de pagamento
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Carrinho</h1>
      
      {/* Exibir notificação se existir */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className={styles.contentContainer}>
        <div className={styles.leftSide}>        
          {documents.length > 0 ? (
            documents.map((document) => (
              <div key={document.id} className={styles.documentCard}>
                <img
                  className={styles.documentImage}
                  src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${document.image}`}
                  alt={document.title}
                />
                <div className={styles.documentInfo}>
                  <h2 className={styles.documentTitle}>{document.title}</h2>
                  <p className={styles.documentPrice}>
                    {document.precoDesconto ? `R$ ${document.precoDesconto}` : `R$ ${document.preco}`}
                  </p>
                  <p className={styles.access}>Acesso limitado</p>
                </div>
                <img
                  src="/icon/trash.svg"
                  alt="Remover"
                  className={styles.trashIcon}
                  onClick={() => handleRemoveItem(document.id!)}
                />
              </div>
            ))
          ) : (
            <p className={styles.emptyMessage}>O carrinho está vazio.</p>
          )}
        </div>

        <div className={styles.rightSide}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Resumo do pedido</h2>
            <p className={styles.summaryItems}>Número de itens: {documents.length}</p>
            <hr className={styles.separator} />

            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>

            {/* Se houver desconto, exibir o valor do desconto */}
            {discount > 0 && (
              <div className={styles.discountRow}>
                <span>Desconto</span>
                <span>- R$ {discount.toFixed(2)}</span>
              </div>
            )}

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>R$ {(subtotal - discount).toFixed(2)}</span>
            </div>

            {/* Código promocional */}
            <h3 className={styles.promoTitle}>Tem um código promocional?</h3>
            <div className={styles.promoContainer}>
              <input
                type="text"
                className={styles.promoInput}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Insira o código"
              />
              <button className={styles.applyButton} onClick={handleApplyPromoCode}>
                Aplicar
              </button>
            </div>

            {/* Botão de pagamento */}
            <button className={styles.payButton} onClick={handlePayment}>
              Pronto para pagar
            </button>
          </div>

          {/* Pagamento seguro e ícones das formas de pagamento */}
          <div className={styles.paymentInfo}>
            <div className={styles.paymentTextContainer}>
              <img src="/icon/assurance.svg" alt="Pagamento seguro" className={styles.assuranceIcon} />
              <span className={styles.paymentText}>Pagamento seguro</span>
            </div>
            <div className={styles.paymentIconsContainer}>
              <img src="/icon/visa.svg" alt="Visa" className={styles.paymentIcon} />
              <img src="/icon/masterCard.svg" alt="MasterCard" className={styles.paymentIcon} />
              <img src="/icon/elo.svg" alt="Elo" className={styles.paymentIcon} />
              <img src="/icon/amex.svg" alt="Amex" className={styles.paymentIcon} />
              <img src="/icon/pix.svg" alt="Pix" className={styles.paymentIcon} />
              <img src="/icon/boleto.svg" alt="Boleto" className={styles.paymentIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
