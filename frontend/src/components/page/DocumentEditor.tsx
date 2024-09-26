// src/components/page/DocumentEditor.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Toolbox from './Toolbox'; // Caminho correto
import Page, { ElementType } from './Page'; // Importar ElementType
import './DocumentEditor.css';
import { v4 as uuidv4 } from 'uuid'; // Importar uuid

const A4_WIDTH = 595; // Largura em pixels para 72 DPI
const A4_HEIGHT = 842; // Altura em pixels para 72 DPI

interface PageData {
  id: string;
  elements: ElementType[];
}

const DocumentEditor: React.FC = () => {
  const [pages, setPages] = useState<PageData[]>([
    { id: uuidv4(), elements: [] },
  ]);

  // Definir objeto de refs para as páginas, indexado pelo id da página
  const pagesRefs = useRef<{ [key: string]: React.RefObject<any> }>({});

  // Função para adicionar uma nova página
  const addPage = () => {
    const newPageId = uuidv4();
    setPages(prev => [...prev, { id: newPageId, elements: [] }]);
  };

  // Função para duplicar uma página específica
  const duplicatePage = (index: number) => {
    const originalPage = pages[index];
    const originalPageRef = pagesRefs.current[originalPage.id];

    if (originalPageRef && originalPageRef.current) {
      const originalElements: ElementType[] = originalPageRef.current.getElements();

      // Clonar os elementos com novos IDs
      const duplicatedElements = originalElements.map(elem => ({
        ...elem,
        id: uuidv4(), // Garante um ID único
      }));

      // Adicionar uma nova página com os elementos duplicados
      const newPageId = uuidv4();
      setPages(prev => [
        ...prev,
        { id: newPageId, elements: duplicatedElements },
      ]);
    }
  };

  // Função para excluir uma página específica
  const deletePage = (id: string) => {
    setPages(prev => prev.filter(page => page.id !== id));

    // Opcional: Remover o ref correspondente
    delete pagesRefs.current[id];
  };

  // useEffect para definir elementos após atualização das páginas
  useEffect(() => {
    pages.forEach((pageData) => {
      if (pageData.elements.length > 0) {
        const pageRef = pagesRefs.current[pageData.id];
        if (pageRef && pageRef.current) {
          pageRef.current.setElements(pageData.elements);
        }
      }
    });
  }, [pages]);

  return (
    <div className="document-editor-container">
      <Toolbox />
      <div className="pages-container">
        {pages.map((pageData, index) => {
          // Criar um ref para cada página, se ainda não existir
          if (!pagesRefs.current[pageData.id]) {
            pagesRefs.current[pageData.id] = React.createRef();
          }

          return (
            <div key={pageData.id} className="page-wrapper">
              <Page
                width={A4_WIDTH}
                height={A4_HEIGHT}
                ref={pagesRefs.current[pageData.id]}
              />
              <div className="page-buttons">
                {/* Botão de Duplicar Página */}
                <button
                  onClick={() => duplicatePage(index)}
                  className="duplicate-page-button"
                  title="Duplicar Página"
                >
                  Duplicar Página
                </button>
                {/* Botão de Excluir Página */}
                <button
                  onClick={() => deletePage(pageData.id)}
                  className="delete-page-button"
                  title="Excluir Página"
                >
                  Excluir Página
                </button>
              </div>
            </div>
          );
        })}
      </div>
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
