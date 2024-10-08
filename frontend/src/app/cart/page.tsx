// src/app/cart/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { getDocumentById, DocumentData } from '@/services/documentApi';
import { getPackageById, Package } from '@/services/packageService';
import { getActiveCouponByName } from '@/services/couponService';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation'; 
import { usePayment } from '../../context/PaymentContext';
import Notification from '../../components/notification/Notification';
import styles from './cart.module.css';

interface CartItem {
  type: 'document' | 'package';
  id: string;
}

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart } = useCart();
  const { setTotalAmount } = usePayment();
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>(''); // Cupom promocional
  const [discount, setDiscount] = useState<number>(0); // Valor do desconto
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Carregar cupom salvo do localStorage e aplicar automaticamente
  useEffect(() => {
    const storedPromoCode = localStorage.getItem('promoCode');
    if (storedPromoCode) {
      setPromoCode(storedPromoCode);
    }
  }, []);

  // Atualizar subtotal quando os itens do carrinho mudam
  useEffect(() => {
    const fetchCartItems = async () => {
      const fetchedDocuments: DocumentData[] = [];
      const fetchedPackages: Package[] = [];
      let total = 0;

      for (const item of cartItems) {
        if (item.type === 'document') {
          try {
            const document = await getDocumentById(item.id);
            fetchedDocuments.push(document);
            total += document.precoDesconto ? document.precoDesconto : document.preco;
          } catch (docError) {
            console.error(`Erro ao buscar documento com ID ${item.id}:`, docError);
          }
        } else if (item.type === 'package') {
          try {
            const pkg = await getPackageById(item.id);
            fetchedPackages.push(pkg);
            total += pkg.precoDesconto ? pkg.precoDesconto : pkg.preco;
          } catch (pkgError) {
            console.error(`Erro ao buscar pacote com ID ${item.id}:`, pkgError);
          }
        }
      }

      setDocuments(fetchedDocuments);
      setPackages(fetchedPackages);
      setSubtotal(total);
    };

    if (cartItems.length > 0) {
      fetchCartItems();
    } else {
      setDocuments([]);
      setPackages([]);
      setSubtotal(0);
    }
  }, [cartItems]);

  // Aplicar automaticamente o cupom quando o subtotal muda
  useEffect(() => {
    if (promoCode && subtotal > 0) {
      applyStoredCoupon(promoCode); // Aplica o desconto baseado no subtotal
    }
  }, [subtotal, promoCode]);

  // Função para aplicar o cupom
  const applyStoredCoupon = async (code: string) => {
    try {
      const response = await getActiveCouponByName(code);
      if ('discountRate' in response) {
        const discountRate = response.discountRate;
        const discountAmount = (subtotal * discountRate) / 100;

        setDiscount(discountAmount); // Aplica o desconto
        setNotification({ message: `Cupom ${code} reaplicado com sucesso!`, type: 'success' });
      } else {
        setNotification({ message: response.message, type: 'error' });
        setDiscount(0); // Remove o desconto caso o código seja inválido
      }
    } catch (error) {
      setNotification({ message: 'Erro ao reaplicar o código promocional.', type: 'error' });
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    if (item) {
      removeFromCart(item);
    } else {
      console.error('Item para remover é indefinido.');
    }
  };

  const handleApplyPromoCode = async () => {
    try {
      const response = await getActiveCouponByName(promoCode);
      
      if ('discountRate' in response) {
        const discountRate = response.discountRate;
        const discountAmount = (subtotal * discountRate) / 100;

        setDiscount(discountAmount); // Aplica o desconto
        setNotification({ message: `Código promocional aplicado com sucesso! Desconto de ${discountRate}%`, type: 'success' });
        
        // Armazena o código promocional no localStorage
        localStorage.setItem('promoCode', promoCode);
      } else {
        setNotification({ message: response.message, type: 'error' });
        setDiscount(0); // Se o código for inválido, remove o desconto
        localStorage.removeItem('promoCode'); // Remove o cupom inválido do localStorage
      }
    } catch (error) {
      setNotification({ message: 'Erro ao aplicar o código promocional.', type: 'error' });
    }
  };

  // Função para monitorar mudanças no campo de cupom
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPromoCode(code);

    if (!code) {
      // Se o campo estiver vazio, remover o desconto e o cupom do localStorage
      setDiscount(0);
      localStorage.removeItem('promoCode');
      setNotification({ message: 'Cupom removido.', type: 'success' });
    }
  };

  const handlePayment = () => {
    if (subtotal > 0 && (documents.length > 0 || packages.length > 0)) {
      const totalAmount = subtotal - discount; // Calcula o valor total com o desconto
      setTotalAmount(totalAmount); // Armazena o total no contexto
      router.push('/cart/payment'); // Redireciona para a página de pagamento
    } else {
      setNotification({ message: 'O carrinho está vazio ou o total é inválido.', type: 'error' });
    }
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
          {documents.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>Documentos</h2>
              {documents.map((document) => (
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
                    onClick={() => {
                      if (document.id) { // Adiciona verificação
                        handleRemoveItem({ type: 'document', id: document.id });
                      } else {
                        console.error('Document ID is undefined.');
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {packages.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>Pacotes</h2>
              {packages.map((pkg) => (
                <div key={pkg.id} className={styles.packageCard}>
                  <div className={styles.packageInfo}>
                    <h2 className={styles.packageTitle}>{pkg.title}</h2>
                    <p className={styles.packagePrice}>
                      {pkg.precoDesconto ? `R$ ${pkg.precoDesconto}` : `R$ ${pkg.preco}`}
                    </p>
                    <p className={styles.packageDescription}>
                      Pacote com {pkg.documentIds.length} documento{pkg.documentIds.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <img
                    src="/icon/trash.svg"
                    alt="Remover"
                    className={styles.trashIcon}
                    onClick={() => {
                      if (pkg.id) { // Adiciona verificação
                        handleRemoveItem({ type: 'package', id: pkg.id });
                      } else {
                        console.error('Package ID is undefined.');
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {(documents.length === 0 && packages.length === 0) && (
            <p className={styles.emptyMessage}>O carrinho está vazio.</p>
          )}
        </div>

        <div className={styles.rightSide}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Resumo do pedido</h2>
            <p className={styles.summaryItems}>Número de itens: {cartItems.length}</p>
            <hr className={styles.separator} />

            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>

            {/* Exibir o desconto se houver */}
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
                onChange={handlePromoCodeChange} // Chama a função ao alterar o valor
                placeholder="Insira o código"
              />
              <button className={styles.applyButton} onClick={handleApplyPromoCode}>
                Aplicar
              </button>
            </div>

            {/* Botão de pagamento */}
            <button 
              className={styles.payButton} 
              onClick={handlePayment} 
              disabled={subtotal === 0 || (documents.length === 0 && packages.length === 0)}
            >
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
