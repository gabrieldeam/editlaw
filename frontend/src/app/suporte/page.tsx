// Suporte.tsx

'use client';

import React, { useState } from 'react';
import styles from './Suporte.module.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import emailjs from 'emailjs-com';

const Suporte: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
    const userID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID!;

    emailjs.send(serviceID, templateID, formData, userID)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setSubmitted(true);
        setError(null);
        // Resetar formulário
        setFormData({
          nome: '',
          email: '',
          assunto: '',
          mensagem: '',
        });
      })
      .catch((err) => {
        console.error('FAILED...', err);
        setError('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente mais tarde.');
      });
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SUPORTE</h1>
      <div className={styles.content}>
        {/* Formulário de Suporte */}
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Envie-nos uma Mensagem</h2>
          {submitted ? (
            <p className={styles.successMessage}>
              Obrigado pelo seu contato! Responderemos sua mensagem em breve.
            </p>
          ) : (
            <>
              {error && <p className={styles.errorMessage}>{error}</p>}
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="nome" className={styles.label}>Nome</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="assunto" className={styles.label}>Assunto</label>
                  <input
                    type="text"
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="mensagem" className={styles.label}>Mensagem</label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    className={styles.textarea}
                  ></textarea>
                </div>
                <button type="submit" className={styles.submitButton}>
                  Enviar
                </button>
              </form>
            </>
          )}
        </section>

        {/* Seção de FAQ */}
        <section className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Perguntas Frequentes (FAQ)</h2>
          {faqData.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button className={styles.faqQuestion} onClick={() => toggleFAQ(index)}>
                <span>{faq.pergunta}</span>
                {activeFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {activeFAQ === index && (
                <div className={styles.faqAnswer}>
                  {faq.resposta}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

const faqData = [
  {
    pergunta: "Como posso criar uma conta na Editlaw?",
    resposta: `Para criar uma conta, clique no botão "Registrar" no canto superior direito do nosso site e preencha os campos obrigatórios com suas informações pessoais. Após o cadastro, você poderá acessar todas as funcionalidades da plataforma.`,
  },
  {
    pergunta: "Quais são os métodos de pagamento aceitos?",
    resposta: `Aceitamos diversos métodos de pagamento, incluindo cartões de crédito, débito e transferências bancárias. Todos os detalhes estão disponíveis na página de pagamentos durante a aquisição do seu plano.`,
  },
  {
    pergunta: "Como funciona a licença de uso dos materiais?",
    resposta: `Ao adquirir um pacote, você recebe uma licença não exclusiva, intransferível e revogável para utilizar os materiais durante o período de vigência do seu plano, que é de 1 (um) ano a partir da data de aquisição. Para mais detalhes, consulte a seção "Concessão de Licença" em nossos Termos de Uso.`,
  },
  {
    pergunta: "Posso cancelar meu plano a qualquer momento?",
    resposta: `Sim, você pode cancelar seu plano a qualquer momento através da seção "Minha Conta". Entretanto, os pagamentos já efetuados não são reembolsáveis, conforme descrito em nossos Termos de Uso.`,
  },
  {
    pergunta: "O que devo fazer se encontrar um problema na plataforma?",
    resposta: `Se você encontrar qualquer problema, por favor, envie-nos uma mensagem através do formulário de suporte ou entre em contato diretamente pelo e-mail <a href="mailto:contato@editlaw.com.br" class="${styles.link}">contato@editlaw.com.br</a>. Nossa equipe de suporte responderá o mais breve possível.`,
  },
  {
    pergunta: "Como posso atualizar minhas informações de conta?",
    resposta: `Para atualizar suas informações de conta, faça login na sua conta e acesse a seção "Minha Conta". Lá, você poderá editar seus dados pessoais, alterar sua senha e gerenciar suas preferências de comunicação.`,
  },
  {
    pergunta: "Quais são os termos para a utilização dos conteúdos em VisualLaw?",
    resposta: `Os conteúdos em VisualLaw são fornecidos conforme a Licença de Uso disponível em nossos Termos de Uso. Você pode utilizar esses conteúdos para fins profissionais, respeitando sempre os limites estabelecidos na licença.`,
  },
];

export default Suporte;
