// src/app/creations/[id]/page.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

// Importação dinâmica do DocumentEditor
const DocumentEditor = dynamic(() => import('../../../components/purchase-page/DocumentEditor'), {
  ssr: false, // Desativa a renderização no servidor
});

const DocumentPage: React.FC = () => {
  const params = useParams(); // Hook para acessar os parâmetros da rota
  let id = params.id;

  // Verifica se id é um array e seleciona o primeiro elemento, caso contrário, mantém como string
  if (Array.isArray(id)) {
    id = id[0];
  }

  // Verifica se id está disponível
  if (!id) {
    return <div>ID do documento não fornecido.</div>;
  }

  return (
    <div className="creations-page-container">
      <DocumentEditor documentId={id} /> {/* Passe o id como prop */}
    </div>
  );
};

export default DocumentPage;
