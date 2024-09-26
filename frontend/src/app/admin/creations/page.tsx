// src/app/admin/creations/page.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DocumentEditor = dynamic(() => import('../../../components/page/DocumentEditor'), {
  ssr: false,
});

const CreationsPage: React.FC = () => {
  return (
    <div>
      <DocumentEditor />
    </div>
  );
};

export default CreationsPage;
