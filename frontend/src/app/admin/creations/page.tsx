// src/app/admin/creations/page.tsx

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import './CreationsPage.css'; // Importa o CSS criado

const DocumentEditor = dynamic(() => import('../../../components/page/DocumentEditor'), {
  ssr: false,
});

const CreationsPage: React.FC = () => {
  return (
    <div className="creations-page-container">
      <DocumentEditor />
    </div>
  );
};

export default CreationsPage;
