"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './payment.module.css';
import { useCart } from '../../../context/CartContext';
import { getDocumentById, DocumentData } from '@/services/documentApi';
import { getBillingInfo, createOrUpdateBillingInfo } from '../../../services/billingService';
import { getUserInfo } from '../../../services/authService'; // Importa o getUserInfo para pegar os dados do usuário
import Input from '../../../components/input/Input';
import Notification from '../../../components/notification/Notification';
import { Payment } from '@mercadopago/sdk-react';

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();

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
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [cvv, setCvv] = useState('');

  // Estado para guardar os dados do usuário
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Verificar autenticação e buscar as informações do usuário
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo(); // Faz a requisição para pegar as informações do usuário
        setUser(userInfo); // Define o estado do usuário com o nome e e-mail retornado
      } catch (error) {
        console.error('Erro ao buscar as informações do usuário:', error);
        router.push(`/auth/login?redirect=${encodeURIComponent('/cart/payment')}`);
      }
    };

    fetchUserInfo();
  }, [router]);

  // Carregar documentos do carrinho
  useEffect(() => {
    const fetchDocuments = async () => {
      const docs: DocumentData[] = [];
      let total = 0;

      for (const itemId of cartItems) {
        const document = await getDocumentById(itemId);
        docs.push(document);
        total += document.precoDesconto ? document.precoDesconto : document.preco;
      }

      setDocuments(docs);
      setSubtotal(total);
    };

    if (cartItems.length > 0) fetchDocuments();
    else setDocuments([]);
  }, [cartItems]);

  // Carregar informações de cobrança
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

  const isBillingInfoValid = () => Object.values(billingInfo).every((field) => field.trim() !== '');

  const handleBillingInfoSave = async () => {
    try {
      await createOrUpdateBillingInfo(billingInfo);
      alert('Informações de cobrança salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar informações de cobrança:', error);
      alert('Erro ao salvar informações de cobrança. Tente novamente.');
    }
  };

  const toggleBillingInfoVisibility = () => setIsBillingInfoVisible(!isBillingInfoVisible);
  const toggleDocumentListVisibility = () => setIsDocumentListVisibility(!isDocumentListVisibility);

  // Configurações para o Payment Brick
  const initialization = {
    amount: subtotal,
    preferenceId: '<PREFERENCE_ID>', // Substitua com seu preferenceId
    payer: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
    },
  };

  const customization = {
    visual: {
      hideFormTitle: true,
      style: {
        theme: 'bootstrap' as const,  // Define explicitamente o valor "bootstrap"
      },
    },
    paymentMethods: {
      creditCard: "all" as const,      // Usa "as const" para garantir que o tipo literal correto seja passado
      debitCard: "all" as const,       // Mesmo ajuste para debitCard
      ticket: "all" as const,          // Mesmo ajuste para ticket
      bankTransfer: "all" as const,    // Mesmo ajuste para bankTransfer
      atm: "all" as const,             // Mesmo ajuste para atm
      maxInstallments: 2
    },
  };

  const onSubmit = async ({ selectedPaymentMethod, formData }: { selectedPaymentMethod: string; formData: any }) => {
    try {
      const response = await fetch('http://localhost:5000/api/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (result.success) {
        clearCart();
        router.push('/purchase-success');
      } else {
        router.push('/purchase-failure');
      }
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      setNotification({ message: 'Erro ao processar o pagamento.', type: 'error' });
    }
  };

  const onError = (error: any) => {
    console.error('Erro no Payment Brick:', error);
  };

  const onReady = () => {
    console.log('Payment Brick pronto para uso.');
  };

  if (!user) {
    return <div>Carregando...</div>; // Exibe carregamento enquanto busca as informações do usuário
  }

  return (
    <div className={styles.paymentContainer}>
      <h1 className={styles.title}>Pagamento</h1>

      <div className={styles.contentContainer}>
        <div className={styles.leftSide}>
          <div className={styles.billingBox}>
            <div className={styles.billingHeader}>
              <h2 className={styles.billingTitle}>Informações de cobrança</h2>
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

          {/* Cartões de crédito - Renderização do Payment Brick */}
          <div className={styles.creditCardBox}>
            <div className={styles.creditCardHeader}>
              <h2 className={styles.creditCardTitle}>Formas de pagamento</h2>
            </div>
            <div id="paymentBrick_container">
              <Payment
                initialization={initialization}
                customization={customization}
                onSubmit={onSubmit}
                onReady={onReady}
                onError={onError}
              />
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

            <button className={styles.payButton} disabled={subtotal === 0 || documents.length === 0 || !isBillingInfoValid()}>
              Pagar
            </button>

            <p className={styles.payText}>
              Ao clicar em "Concluir compra", você aceita nossos Termos e Condições e nossa Política de Privacidade, bem como concorda em cadastrar seu(s) produto(s) em nosso serviço de renovação automática, que pode ser cancelado a qualquer momento.
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
      {notification && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
};

export default PaymentPage;
