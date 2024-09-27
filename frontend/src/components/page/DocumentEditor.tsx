// DocumentEditor.tsx

'use client';

import React, { useState } from 'react';
import Toolbox from './Toolbox';
import Page, { ElementType } from './Page';
import TextList from './TextList';
import styles from './DocumentEditor.module.css';
import { v4 as uuidv4 } from 'uuid';
import CadastroPage from './CadastroPage';

// Definição das interfaces
interface PageData {
  id: string;
  elements: ElementType[];
}

interface TextWithPage extends ElementType {
  pageId: string;
}

interface IconWithPage extends ElementType {
  pageId: string;
}

interface ImageWithPage extends ElementType {
  pageId: string;
}

interface ElementImageWithPage extends ElementType { // Nova interface para ElementImage
  pageId: string;
}

const A4_WIDTH = 595; // Largura em pixels para 72 DPI
const A4_HEIGHT = 842; // Altura em pixels para 72 DPI

const DocumentEditor: React.FC = () => {
  const [pages, setPages] = useState<PageData[]>([
    { id: uuidv4(), elements: [] },
  ]);

  const [selectedElement, setSelectedElement] = useState<{ pageId: string; elementId: string } | null>(null);

  const [activeTab, setActiveTab] = useState<'editor' | 'cadastro'>('editor'); // Estado para controlar a aba ativa

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
    if (selectedElement?.pageId === id) {
      setSelectedElement(null);
    }
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

  const handleTextFormatChange = (id: string, updatedText: Partial<ElementType>) => {
    setPages(prev =>
      prev.map(page => ({
        ...page,
        elements: page.elements.map(el =>
          el.id === id && el.type === 'text' ? { ...el, ...updatedText } : el
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
            if (selectedElement?.elementId === updatedElement.id && selectedElement.pageId === pageId) {
              setSelectedElement(null);
            }
          }
          return { ...page, elements: newElements };
        }
        return page;
      })
    );
  };

  const handleIconChange = (
    pageId: string,
    elementId: string,
    newSrc: string
  ) => {
    setPages(prev =>
      prev.map(page => {
        if (page.id === pageId) {
          const updatedElements = page.elements.map(el =>
            el.id === elementId && el.type === 'icon' ? { ...el, src: newSrc } : el
          );
          return { ...page, elements: updatedElements };
        }
        return page;
      })
    );
  };

  const handleImageChange = (
    pageId: string,
    elementId: string,
    newSrc: string
  ) => {
    setPages(prev =>
      prev.map(page => {
        if (page.id === pageId) {
          const updatedElements = page.elements.map(el =>
            el.id === elementId && el.type === 'image' ? { ...el, src: newSrc } : el
          );
          return { ...page, elements: updatedElements };
        }
        return page;
      })
    );
  };

  const handleElementImageChange = ( // Nova função para ElementImage
    pageId: string,
    elementId: string,
    newSrc: string
  ) => {
    setPages(prev =>
      prev.map(page => {
        if (page.id === pageId) {
          const updatedElements = page.elements.map(el =>
            el.id === elementId && el.type === 'elemetImage' ? { ...el, src: newSrc } : el
          );
          return { ...page, elements: updatedElements };
        }
        return page;
      })
    );
  };

  const handleShapeColorChange = (currentColor: string, newColor: string) => {
    setPages(prev =>
      prev.map(page => ({
        ...page,
        elements: page.elements.map(el =>
          ['rectangle', 'square', 'circle', 'triangle'].includes(el.type) && el.fill === currentColor
            ? { ...el, fill: newColor }
            : el
        ),
      }))
    );
  };

  // Coletar todas as imagens das páginas
  const allImages: ImageWithPage[] = pages.flatMap(page =>
    page.elements
      .filter(el => el.type === 'image')
      .map(el => ({ ...el, pageId: page.id }))
  );

  // Coletar todas as ElementImages das páginas
  const allElementImages: ElementImageWithPage[] = pages.flatMap(page =>
    page.elements
      .filter(el => el.type === 'elemetImage')
      .map(el => ({ ...el, pageId: page.id }))
  );

  // Coletar todas as textos das páginas
  const allTexts: TextWithPage[] = pages.flatMap(page =>
    page.elements
      .filter(el => el.type === 'text')
      .map(el => ({ ...el, pageId: page.id }))
  );

  // Coletar todas as formas das páginas
  const allShapes = pages.flatMap(page =>
    page.elements.filter(el => ['rectangle', 'square', 'circle', 'triangle'].includes(el.type))
  );

  // Coletar todos os ícones das páginas
  const allIcons: IconWithPage[] = pages.flatMap(page =>
    page.elements
      .filter(el => el.type === 'icon')
      .map(el => ({ ...el, pageId: page.id }))
  );

  return (
    <div className={styles.documentEditorContainer}>
      <Toolbox />
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <div className={styles.pagesContainer}>
            {pages.map((pageData, index) => (
              <div key={pageData.id} className={styles.pageWrapper}>
                <Page
                  pageId={pageData.id}
                  width={A4_WIDTH}
                  height={A4_HEIGHT}
                  elements={pageData.elements}
                  onElementsChange={handleElementChange}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                />
                <div className={styles.pageButtons}>
                  <button
                    onClick={() => duplicatePage(index)}
                    className={styles.duplicatePageButton}
                    title="Duplicar Página"
                  >
                    Duplicar Página
                  </button>
                  <button
                    onClick={() => deletePage(pageData.id)}
                    className={styles.deletePageButton}
                    title="Excluir Página"
                  >
                    Excluir Página
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addPage} className={styles.addPageButton}>
            Adicionar Página
          </button>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabButton} ${activeTab === 'editor' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              Editor
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'cadastro' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('cadastro')}
            >
              Cadastro
            </button>
          </div>
          <div className={styles.tabContent}>
            {activeTab === 'editor' ? (
              <TextList
                texts={allTexts}
                shapes={allShapes}
                icons={allIcons}
                images={allImages}            
                onTextChange={handleTextChange}
                onShapeColorChange={handleShapeColorChange}
                onTextFormatChange={handleTextFormatChange}
                onIconChange={handleIconChange}
                onImageChange={handleImageChange}            
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
              />
            ) : (
              <div className={styles.cadastroContent}>
                <CadastroPage />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
