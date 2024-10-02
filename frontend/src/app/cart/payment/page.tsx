"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './payment.module.css'; 
import { useCart } from '../../../context/CartContext';
import { getDocumentById, DocumentData } from '@/services/documentApi';
import { getBillingInfo, createOrUpdateBillingInfo } from '../../../services/billingService';
import Input from '../../../components/input/Input';
import Notification from '../../../components/notification/Notification';
import { useAuth } from '../../../context/AuthContext';

const PaymentPage: React.FC = () => {
  // Removemos o uso do contexto PaymentContext
  // const { totalAmount } = usePayment();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems } = useCart();
  const { isAuthenticated, loading } = useAuth();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [billingInfo, setBillingInfo] = useState({
    country: '',
    phone: '',
    street: '',
    district: '',
    city: '',
    state: '',
    postalCode: '',
    cpf: '',
  });
  const [hasBillingData, setHasBillingData] = useState(false);
  const [loadingBillingInfo, setLoadingBillingInfo] = useState(true);
  const [isBillingInfoVisible, setIsBillingInfoVisible] = useState(false);
  const [isDocumentListVisibility, setIsDocumentListVisibility] = useState(false);
  const [isCardVisibility, setIsCardVisibility] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Verificar autenticação
  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    console.log('loading:', loading);
    if (!loading && !isAuthenticated) {
      // Redireciona para a página de login com o parâmetro de redirecionamento
      router.push(`/auth/login?redirect=${encodeURIComponent('/cart/payment')}`);
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
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
    } else {
      setDocuments([]); // Limpa os documentos quando o carrinho está vazio
      setSubtotal(0);    // Reseta o subtotal
    }
  }, [cartItems]);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const billingData = await getBillingInfo();
        if (billingData) {
          setBillingInfo(billingData);
          setHasBillingData(true);
        }
      } catch (error) {
        console.error('Erro ao buscar informações de cobrança:', error);
      } finally {
        setLoadingBillingInfo(false);
      }
    };

    fetchBillingInfo();
  }, []);

  const isBillingInfoValid = () => {
    // Verifica se todos os campos do objeto billingInfo estão preenchidos
    return Object.values(billingInfo).every((field) => field.trim() !== '');
  };
  
  const hasMissingBillingInfo = () => {
    return Object.values(billingInfo).some((field) => field.trim() === '');
  };

  const handleCardSave = async () => {
    try {
      alert('Cartão cadastrado com sucesso!');
    } catch (error) {
      alert('Erro ao salvar informações do cartão. Tente novamente.');
    }
  };

  const handleBillingInfoSave = async () => {
    try {
      await createOrUpdateBillingInfo(billingInfo);
      alert('Informações de cobrança salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar informações de cobrança:', error);
      alert('Erro ao salvar informações de cobrança. Tente novamente.');
    }
  };

  const toggleBillingInfoVisibility = () => {
    setIsBillingInfoVisible(!isBillingInfoVisible); // Alterna a visibilidade
  };

  const toggleDocumentListVisibility = () => {
    setIsDocumentListVisibility(!isDocumentListVisibility); // Alterna a visibilidade
  };

  const toggleCardVisibility = () => {
    setIsCardVisibility(!isCardVisibility); // Alterna a visibilidade
  };

  const handleConfirmPayment = () => {
    // Usamos subtotal em vez de totalAmount
    if (subtotal > 0 && documents.length > 0 && isBillingInfoValid()) {
      setNotification({ message: 'Pagamento confirmado', type: 'success' });
      // Aqui você pode adicionar a lógica para processar o pagamento
    } else {
      setNotification({ message: 'O carrinho está vazio, o total é inválido ou as informações de cobrança estão incompletas.', type: 'error' });
    }
  };

  // Exibir um indicador de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  return (
    <div className={styles.paymentContainer}>
      <h1 className={styles.title}>Pagamento</h1>

      <div className={styles.contentContainer}>
        <div className={styles.leftSide}>
          <div className={styles.billingBox}>
            <div className={styles.billingHeader}>
              <h2 className={styles.billingTitle}>Informações de cobrança</h2>
              {hasMissingBillingInfo() && (
                <p className={styles.missingInfo}>Falta preencher</p>
              )}
              <img
                src="/icon/down-arrow.svg"
                alt="Mostrar ou esconder informações de cobrança"
                className={`${styles.arrowIcon} ${isBillingInfoVisible ? styles.arrowUp : ''}`}
                onClick={toggleBillingInfoVisibility}
              />
            </div>

            {isBillingInfoVisible && (
              <>
                {loadingBillingInfo ? (
                  <p>Carregando informações de cobrança...</p>
                ) : (
                  <>
                    <Input
                      label="País"
                      name="country"
                      type="text"
                      value={billingInfo.country}
                      onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                    />
                    <Input
                      label="CEP"
                      name="postalCode"
                      type="text"
                      value={billingInfo.postalCode}
                      onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
                    />
                    <Input
                      label="Rua"
                      name="street"
                      type="text"
                      value={billingInfo.street}
                      onChange={(e) => setBillingInfo({ ...billingInfo, street: e.target.value })}
                    />

                    <div className={styles.inputRow}>
                      <Input
                        label="Bairro"
                        name="district"
                        type="text"
                        value={billingInfo.district}
                        onChange={(e) => setBillingInfo({ ...billingInfo, district: e.target.value })}
                      />
                      <Input
                        label="Cidade"
                        name="city"
                        type="text"
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                      />
                      <Input
                        label="Estado"
                        name="state"
                        type="text"
                        value={billingInfo.state}
                        onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                      />
                    </div>

                    <div className={styles.inputRow}>
                      <Input
                        label="Telefone"
                        name="phone"
                        type="text"
                        value={billingInfo.phone}
                        onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                      />
                      <Input
                        label="CPF"
                        name="cpf"
                        type="text"
                        value={billingInfo.cpf}
                        onChange={(e) => setBillingInfo({ ...billingInfo, cpf: e.target.value })}
                      />
                    </div>

                    <div className={styles.billingInfoButtonContainer}>
                      <button className={styles.billingInfoButton} onClick={handleBillingInfoSave}>
                        {hasBillingData ? 'Atualizar' : 'Salvar'} Informações
                      </button>
                      <button className={styles.billingInfoButtonCancelar} onClick={toggleBillingInfoVisibility}>
                        Cancelar
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className={styles.billingBox}>
            <div className={styles.billingHeader}>
              <h2 className={styles.billingTitle}>Informações de cobrança</h2>    
              <img
                src="/icon/down-arrow.svg"
                alt="Mostrar ou esconder informações de cobrança"
                className={`${styles.arrowIcon} ${isBillingInfoVisible ? styles.arrowUp : ''}`}
                onClick={toggleCardVisibility}
              />
            </div>
          
            <div className={styles.billingInfoButtonContainer}>
              <button className={styles.billingInfoButton} onClick={handleCardSave}>
                {hasBillingData ? 'Atualizar' : 'Salvar'} Informações
              </button>
              <button className={styles.billingInfoButtonCancelar} onClick={toggleCardVisibility}>
                Cancelar
              </button>
            </div> 
          </div>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
              <h2 className={styles.summaryTitle}>Resumo do pedido</h2>
              <button className={styles.cancelButton} onClick={() => router.back()}>
                Editar pedido
              </button>
            </div>

            <p className={styles.summaryItems}>Número de itens: {documents.length}</p>
            <hr className={styles.separator} />

            <div className={styles.subtotalRow}>
              <span>Total a pagar:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>

            <button 
              className={styles.payButton} 
              onClick={handleConfirmPayment}
              disabled={subtotal === 0 || documents.length === 0 || !isBillingInfoValid()}             
            >
              Pagar
            </button>

            <p className={styles.payText}>
              Ao clicar em "Concluir compra", você aceita nossos Termos e Condições e nossa Política de Privacidade, bem como concorda em cadastrar seu(s) produto(s) em nosso serviço de renovação automática, que pode ser cancelado a qualquer momento por meio da página “Renovações e cobrança” em sua conta. Para as renovações automáticas, a cobrança é feita com o método de pagamento selecionado para este pedido ou seu(s) método(s) de pagamento alternativo(s), até o cancelamento. Seus dados de pagamento serão salvos como um método de pagamento alternativo para futuras compras e renovações de assinatura. Seu pagamento está sendo processado em: Brasil.
            </p>
          </div>

          {/* Pagamento seguro e ícones das formas de pagamento */}
          <div className={styles.paymentInfo}>
            <div className={styles.paymentTextContainer}>
              <img src="/icon/assurance.svg" alt="Pagamento seguro" className={styles.assuranceIcon} />
              <span className={styles.paymentText}>Finalização de compra segura</span>
            </div>            
          </div>

          <div className={styles.documentList}>
            <div className={styles.documentListHeader}>
              <h2 className={styles.documentListTitle}>Seus itens</h2>
              <img
                src="/icon/down-arrow.svg"
                alt="Mostrar ou esconder itens"
                className={`${styles.arrowIcon} ${isDocumentListVisibility ? styles.arrowUp : ''}`}
                onClick={toggleDocumentListVisibility}
              />
            </div>            
            {isDocumentListVisibility && (
              <>
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
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyMessage}>O carrinho está vazio.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Exibir notificação se existir */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
};

export default PaymentPage;
