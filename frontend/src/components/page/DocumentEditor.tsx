// src/components/page/DocumentEditor.tsx

import React, { useState } from 'react';
import Toolbox from './Toolbox';
import Page, { ElementType } from './Page';
import TextList from './TextList';
import './DocumentEditor.css';
import { v4 as uuidv4 } from 'uuid';

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

  const addPage = () => {
    const newPageId = uuidv4();
    setPages(prev => [...prev, { id: newPageId, elements: [] }]);
  };

  const duplicatePage = (index: number) => {
    const originalPage = pages[index];
    const duplicatedElements = originalPage.elements.map(elem => ({
      ...elem,
      id: uuidv4(),
    }));

    const newPageId = uuidv4();
    setPages(prev => [
      ...prev,
      { id: newPageId, elements: duplicatedElements },
    ]);
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(page => page.id !== id));
  };

  const handleTextChange = (id: string, newText: string) => {
    setPages(prev =>
      prev.map(page => ({
        ...page,
        elements: page.elements.map(el =>
          el.id === id && el.type === 'text' ? { ...el, content: newText } : el
        ),
      }))
    );
  };

  const handleElementChange = (
    pageId: string,
    updatedElement: ElementType | null,
    action: 'add' | 'update' | 'delete'
  ) => {
    setPages(prev =>
      prev.map(page => {
        if (page.id === pageId) {
          let newElements = [...page.elements];
          if (action === 'add' && updatedElement) {
            newElements.push(updatedElement);
          } else if (action === 'update' && updatedElement) {
            newElements = newElements.map(el =>
              el.id === updatedElement.id ? updatedElement : el
            );
          } else if (action === 'delete' && updatedElement) {
            newElements = newElements.filter(el => el.id !== updatedElement.id);
          }
          return { ...page, elements: newElements };
        }
        return page;
      })
    );
  };

  // Identificar todos os textos
  const allTexts = pages.flatMap(page =>
    page.elements.filter(el => el.type === 'text')
  );

  // Identificar todas as formas
  const allShapes = pages.flatMap(page =>
    page.elements.filter(el => ['rectangle', 'square', 'circle', 'triangle', 'icon'].includes(el.type))
  );

  // Função para alterar a cor de todas as formas de um grupo específico
  const handleShapeColorChange = (currentColor: string, newColor: string) => {
    setPages(prev =>
      prev.map(page => ({
        ...page,
        elements: page.elements.map(el =>
          ['rectangle', 'square', 'circle', 'triangle', 'icon'].includes(el.type) && el.fill === currentColor
            ? { ...el, fill: newColor }
            : el
        ),
      }))
    );
  };

  return (
    <div className="document-editor-container">
      <Toolbox />
      <div className="editor-content">
        <div className="pages-container">
          {pages.map((pageData, index) => (
            <div key={pageData.id} className="page-wrapper">
              <Page
                pageId={pageData.id}
                width={A4_WIDTH}
                height={A4_HEIGHT}
                elements={pageData.elements}
                onElementsChange={handleElementChange}
              />
              <div className="page-buttons">
                <button
                  onClick={() => duplicatePage(index)}
                  className="duplicate-page-button"
                  title="Duplicar Página"
                >
                  Duplicar Página
                </button>
                <button
                  onClick={() => deletePage(pageData.id)}
                  className="delete-page-button"
                  title="Excluir Página"
                >
                  Excluir Página
                </button>
              </div>
            </div>
          ))}
        </div>
        <TextList
          texts={allTexts}
          shapes={allShapes}
          onTextChange={handleTextChange}
          onShapeColorChange={handleShapeColorChange}
        />
      </div>
      <button onClick={addPage} className="add-page-button">
        Adicionar Página
      </button>
    </div>
  );
};

export default DocumentEditor;
