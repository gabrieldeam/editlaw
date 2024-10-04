import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Request, Response } from 'express';

// Configura o Mercado Pago com o Access Token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
});

const payment = new Payment(client);

export const processPayment = async (req: Request, res: Response) => {
  try {
    // Log para verificar como os dados estão chegando
    console.log('Dados recebidos no req.body:', JSON.stringify(req.body, null, 2));

    const { transaction_amount, token, payment_method_id, payer, installments, issuer_id } = req.body;

    // Verifica se os campos essenciais estão presentes
    if (!transaction_amount || !token || !payment_method_id || !payer || !payer.email || !payer.identification) {
      console.error('Dados incompletos:', req.body);
      return res.status(400).json({
        message: 'Dados do pagamento incompletos. Verifique e tente novamente.'
      });
    }

    // Preparar os dados do pagamento
    const paymentData = {
      transaction_amount,
      token,
      description: req.body.description || 'Compra de documentos',
      installments: installments || 1,
      payment_method_id,
      issuer_id,
      payer: {
        email: payer.email,
        identification: {
          type: payer.identification.type,
          number: payer.identification.number,
        },
      },
      external_reference: req.body.external_reference || 'MP123456',
    };

    // Log para verificar se o paymentData está correto
    console.log('Dados do pagamento:', JSON.stringify(paymentData, null, 2));

    // Criar o pagamento usando o SDK do Mercado Pago
    const paymentResponse = await payment.create({ body: paymentData });

    const { status, status_detail, id } = paymentResponse;

    // Verifica se o pagamento foi aprovado
    if (status === 'approved') {
      return res.status(200).json({
        message: 'Pagamento aprovado!',
        payment: paymentResponse,
      });
    } else {
      console.error('Pagamento rejeitado:', {
        id,
        status,
        status_detail,
        payment_method_id: paymentResponse.payment_method_id,
        issuer_id: paymentResponse.issuer_id,
        payer: paymentResponse.payer,
      });

      return res.status(400).json({
        message: 'Pagamento não aprovado.',
        reason: status_detail,
        payment: paymentResponse,
      });
    }
  } catch (error: any) {
    // Log para erros
    console.error('Erro ao processar o pagamento:', error);

    // Retorna o erro
    if (error.response) {
      console.error('Erro na API do Mercado Pago:', error.response.data);
      return res.status(500).json({ message: 'Erro no Mercado Pago', error: error.response.data });
    } else {
      return res.status(500).json({ message: 'Erro interno', error });
    }
  }
};
