"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './payment.module.css';
import { useCart } from '../../../context/CartContext';
import { getDocumentById, DocumentData } from '@/services/documentApi';
import { getBillingInfo, createOrUpdateBillingInfo } from '../../../services/billingService';
import { getCreditCards, createCreditCard } from '@/services/creditCardService';
import { CreditCard } from '@/types/creditCard';
import Input from '../../../components/input/Input';
import Notification from '../../../components/notification/Notification';
import { useAuth } from '../../../context/AuthContext';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { isAuthenticated, loading, user } = useAuth();

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

  // Estados para cartões de crédito
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [isAddCardVisible, setIsAddCardVisible] = useState(false);
  const [newCardData, setNewCardData] = useState({
    name: '',
    cardNumber: '',
    expirationDate: '',
  });

  // Estado para CVV durante o pagamento
  const [cvv, setCvv] = useState('');

  // Estado para instância do Mercado Pago
  const [mp, setMp] = useState<any>(null);

  // Verificar autenticação
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent('/cart/payment')}`);
    }
  }, [isAuthenticated, loading, router]);

  // Carregar o script do Mercado Pago usando useEffect
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
      console.log('Script do Mercado Pago carregado via useEffect');
      if (window.MercadoPago) {
        console.log('window.MercadoPago está disponível via useEffect');

        const mercadoPagoInstance = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
          locale: 'pt-BR',
        });
        console.log('Chave Pública:', process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);
        setMp(mercadoPagoInstance);
      } else {
        console.error('Mercado Pago SDK não está disponível após carregamento via useEffect');
      }
    };
    script.onerror = () => {
      console.error('Erro ao carregar o script do Mercado Pago');
    };
    document.body.appendChild(script);
  }, []);

  // Carregar documentos do carrinho
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
      setDocuments([]);
      setSubtotal(0);
    }
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

  // Carregar cartões de crédito
  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        const cards = await getCreditCards();
        setCreditCards(cards);

        if (cards.length > 0) {
          setSelectedCardId(cards[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar cartões de crédito:', error);
      }
    };

    fetchCreditCards();
  }, []);

  const isBillingInfoValid = () => {
    return Object.values(billingInfo).every((field) => field.trim() !== '');
  };

  const hasMissingBillingInfo = () => {
    return Object.values(billingInfo).some((field) => field.trim() === '');
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
    setIsBillingInfoVisible(!isBillingInfoVisible);
  };

  const toggleDocumentListVisibility = () => {
    setIsDocumentListVisibility(!isDocumentListVisibility);
  };

  const handleAddCard = async () => {
    try {
      if (
        newCardData.name &&
        newCardData.cardNumber &&
        newCardData.expirationDate
      ) {
        await createCreditCard({
          name: newCardData.name,
          cardNumber: newCardData.cardNumber,
          expirationDate: newCardData.expirationDate,
          // Não envie o CVV ao backend
        });

        const cards = await getCreditCards();
        setCreditCards(cards);

        setNewCardData({
          name: '',
          cardNumber: '',
          expirationDate: '',
        });

        setIsAddCardVisible(false);

        setNotification({ message: 'Cartão cadastrado com sucesso!', type: 'success' });
      } else {
        setNotification({ message: 'Por favor, preencha todos os campos do cartão.', type: 'error' });
      }
    } catch (error) {
      console.error('Erro ao adicionar cartão:', error);
      setNotification({ message: 'Erro ao adicionar cartão.', type: 'error' });
    }
  };

  const handleConfirmPayment = async () => {
    try {
      if (isAddCardVisible) {
        await handleAddCard();
      }

      const selectedCard = creditCards.find((card) => card.id === selectedCardId);

      if (!selectedCard) {
        setNotification({ message: 'Selecione um cartão para realizar o pagamento.', type: 'error' });
        return;
      }

      if (!cvv) {
        setNotification({ message: 'Por favor, insira o CVV do cartão.', type: 'error' });
        return;
      }

      if (!mp) {
        setNotification({ message: 'Mercado Pago não inicializado.', type: 'error' });
        return;
      }

      if (!user) {
        setNotification({ message: 'Usuário não autenticado.', type: 'error' });
        return;
      }

      // Coletar dados do cartão
      const cardData = {
        cardholderName: selectedCard.name,
        cardNumber: selectedCard.cardNumber.replace(/\s+/g, ''),
        expirationMonth: selectedCard.expirationDate.split('-')[1],
        expirationYear: selectedCard.expirationDate.split('-')[0],
        securityCode: cvv,
        identificationType: 'CPF',
        identificationNumber: billingInfo.cpf,
      };

      console.log('Dados do cartão:', cardData);

      const cardTokenData = {
        cardNumber: cardData.cardNumber,
        cardholderName: cardData.cardholderName,
        cardExpirationMonth: cardData.expirationMonth,
        cardExpirationYear: cardData.expirationYear,
        securityCode: cardData.securityCode,
        identificationType: cardData.identificationType,
        identificationNumber: cardData.identificationNumber,
      };

      console.log('Dados enviados para createCardToken:', cardTokenData);

      // Criar token do cartão
      const tokenResult = await mp.createCardToken(cardTokenData);

      console.log('Resultado do createCardToken:', tokenResult);

      if (tokenResult?.error) {
        console.error('Erro ao criar token do cartão:', tokenResult.error);
        setNotification({ message: 'Erro ao criar token do cartão.', type: 'error' });
        return;
      }

      const token = tokenResult.id;

      // Obter payment_method_id
      const bin = cardData.cardNumber.substring(0, 6);
      const paymentMethods = await mp.getPaymentMethods({ bin });

      if (paymentMethods?.results?.length === 0) {
        setNotification({ message: 'Não foi possível determinar o método de pagamento.', type: 'error' });
        return;
      }

      const paymentMethodId = paymentMethods.results[0].id;

      // Montar dados do pagamento
      const paymentData = {
        token,
        transaction_amount: subtotal,
        description: 'Compra de documentos',
        installments: 1,
        payment_method_id: paymentMethodId,
        payer: {
          email: user.email,
          identification: {
            type: cardData.identificationType,
            number: cardData.identificationNumber,
          },
        },
      };

      console.log('Dados do pagamento a serem enviados para o backend:', paymentData);

      // Enviar pagamento para o backend
      const response = await fetch('/api/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      console.log('Resposta do backend:', result);

      if (result.status === 'approved') {
        // Limpar o carrinho
        clearCart();

        // Redirecionar para a página de sucesso
        router.push('/purchase-success');
      } else {
        // Redirecionar para a página de falha
        router.push('/purchase-failure');
      }
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      setNotification({ message: 'Erro ao processar o pagamento.', type: 'error' });
    }
  };

  const handlePayWithBoleto = () => {
    // Implemente a lógica para pagamento com boleto
    alert('Pagamento com boleto não implementado.');
  };

  const handlePayWithPix = () => {
    // Implemente a lógica para pagamento com pix
    alert('Pagamento com pix não implementado.');
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

          {/* Cartões de crédito */}
          <div className={styles.creditCardBox}>
            <div className={styles.creditCardHeader}>
              <h2 className={styles.creditCardTitle}>Formas de pagamento</h2>
            </div>

            {creditCards.length > 0 ? (
              <select
                className={styles.cardSelect}
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
              >
                {creditCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name} - **** **** **** {card.cardNumber.slice(-4)}
                  </option>
                ))}
              </select>
            ) : (
              <p>Nenhum cartão cadastrado.</p>
            )}

            <hr className={styles.separator} />

            <div className={styles.buttonContainer}>
              <button className={styles.addButton} onClick={() => setIsAddCardVisible(true)}>
                Adicionar cartão
              </button>
              <button className={styles.payWithButton} onClick={handlePayWithBoleto}>
                Pagar com boleto
              </button>
              <button className={styles.payWithButton} onClick={handlePayWithPix}>
                Pagar com pix
              </button>
            </div>

            {isAddCardVisible && (
              <div className={styles.addCardForm}>
                <Input
                  label="Nome no Cartão"
                  name="name"
                  type="text"
                  value={newCardData.name}
                  onChange={(e) => setNewCardData({ ...newCardData, name: e.target.value })}
                />
                <Input
                  label="Número do Cartão"
                  name="cardNumber"
                  type="text"
                  value={newCardData.cardNumber}
                  onChange={(e) => setNewCardData({ ...newCardData, cardNumber: e.target.value })}
                />
                <Input
                  label="Data de Expiração"
                  name="expirationDate"
                  type="month"
                  value={newCardData.expirationDate}
                  onChange={(e) => setNewCardData({ ...newCardData, expirationDate: e.target.value })}
                />
                <div className={styles.cardFormButtons}>
                  <button className={styles.saveCardButton} onClick={handleAddCard}>
                    Salvar Cartão
                  </button>
                  <button className={styles.cancelCardButton} onClick={() => setIsAddCardVisible(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
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

            {/* Campo para CVV durante o pagamento */}
            <Input
              label="CVV"
              name="cvv"
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />

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
