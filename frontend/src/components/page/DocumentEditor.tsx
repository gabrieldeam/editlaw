// src/components/page/DocumentEditor.tsx

'use client';

import React, { useState, useRef } from 'react';
import Toolbox from './Toolbox'; // Correct import path
import Page from './Page';
import './DocumentEditor.css';

const A4_WIDTH = 595; // Width in pixels for 72 DPI
const A4_HEIGHT = 842; // Height in pixels for 72 DPI

const DocumentEditor: React.FC = () => {
  const [pages, setPages] = useState<number[]>([1]);

  // Define array of refs for pages
  const pagesRefs = useRef<Array<any>>([]);

  const addPage = () => {
    setPages([...pages, pages.length + 1]);
  };

  return (
    <div>
      <Toolbox />
      {pages.map((pageNumber, index) => {
        // Create a ref for each page
        if (!pagesRefs.current[index]) {
          pagesRefs.current[index] = React.createRef();
        }

        return (
          <Page
            key={pageNumber}
            width={A4_WIDTH}
            height={A4_HEIGHT}
            ref={pagesRefs.current[index]}
          />
        );
      })}
      <button
        onClick={addPage}
        className="add-page-button"
      >
        Adicionar Página
      </button>
    </div>
  );
};

export default DocumentEditor;
