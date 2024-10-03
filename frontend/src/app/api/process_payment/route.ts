// src/app/api/process_payment/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mercadopago from 'mercadopago';

// Configure o Mercado Pago com o Access Token
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payment_data = {
      transaction_amount: Number(body.transaction_amount),
      token: body.token,
      description: body.description,
      installments: Number(body.installments),
      payment_method_id: body.payment_method_id,
      issuer_id: body.issuer_id,
      payer: {
        email: body.payer.email,
        identification: {
          type: body.payer.identification.type,
          number: body.payer.identification.number,
        },
      },
    };

    // Adicione logs para depuração
    console.log('Dados enviados para o Mercado Pago:', payment_data);

    // Cria o pagamento utilizando o método create do SDK
    const response = await mercadopago.payment.create(payment_data);

    // Retorna a resposta do Mercado Pago como JSON
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Erro ao criar pagamento:', error);
    // Retorna um erro 500 com a mensagem de erro
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
