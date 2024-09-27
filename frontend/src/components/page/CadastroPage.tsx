// CadastroPage.tsx

'use client';

import React, { useState } from 'react';
import Input from '../input/Input';
import Notification from '../notification/Notification';
import styles from './cadastro.module.css';
import { useRouter } from 'next/navigation';
// Removido: import { registerItem } from '../../../services/itemService';

const CadastroPage: React.FC = () => {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [precoDesconto, setPrecoDesconto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [autor, setAutor] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica dos campos
    if (!nome || !preco || !descricao || !autor) {
      setNotification({ message: 'Por favor, preencha todos os campos obrigatórios.', type: 'error' });
      return;
    }

    // Validação do preço
    const precoNum = parseFloat(preco);
    const precoDescontoNum = parseFloat(precoDesconto);
    if (isNaN(precoNum) || precoNum < 0) {
      setNotification({ message: 'Preço inválido.', type: 'error' });
      return;
    }
    if (precoDesconto && (isNaN(precoDescontoNum) || precoDescontoNum < 0 || precoDescontoNum > precoNum)) {
      setNotification({ message: 'Preço com desconto inválido.', type: 'error' });
      return;
    }

    try {
      // Removido: Chamada ao endpoint de cadastro
      /*
      const data = await registerItem({
        nome,
        preco: precoNum,
        precoDesconto: precoDescontoNum,
        descricao,
        autor,
      });
      */

      // Simulação de cadastro bem-sucedido
      setNotification({ message: 'Cadastro realizado com sucesso!', type: 'success' });
      console.log('Cadastro bem-sucedido:', { nome, preco: precoNum, precoDesconto: precoDescontoNum, descricao, autor });

      // Limpar os campos após o cadastro
      setNome('');
      setPreco('');
      setPrecoDesconto('');
      setDescricao('');
      setAutor('');

      // Opcional: Redirecionar ou atualizar a lista de itens
      // router.push('/alguma-rota');
    } catch (error) {
      // Removido: Erro no cadastro via endpoint
      /*
      setNotification({ message: 'Erro no cadastro. Tente novamente.', type: 'error' });
      console.error('Erro no cadastro:', error);
      */
      // Simulação de erro no cadastro
      setNotification({ message: 'Erro no cadastro. Tente novamente.', type: 'error' });
      console.error('Erro no cadastro:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Exibe a notificação, se houver */}
      {notification && <Notification message={notification.message} type={notification.type} />}

      <h1 className={styles.title}>Cadastro de Item</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Nome"
          name="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Input
          label="Preço"
          name="preco"
          type="number"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <Input
          label="Preço com Desconto"
          name="precoDesconto"
          type="number"
          value={precoDesconto}
          onChange={(e) => setPrecoDesconto(e.target.value)}
        />
        <div className={styles.textareaContainer}>
          <label htmlFor="descricao" className={styles.label}>Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={styles.textarea}
            required
          />
        </div>
        <Input
          label="Autor"
          name="autor"
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <button className={styles.button} type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastroPage;
