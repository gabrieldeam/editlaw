'use client';

import React, { useState, useEffect } from 'react';
import Page, { ElementType } from './Page';
import TextList from './TextList';
import styles from './DocumentEditor.module.css';
import { getPagesByDocumentId } from '../../services/pageService';
import { getElementsByPageId } from '../../services/elementService';
import { getDocumentById, DocumentDataCategory } from '../../services/documentApi';
import { useCart } from '../../context/CartContext'; // Importação do contexto de carrinho
import { useRouter } from 'next/navigation'; // Importação do roteador

interface PageData {
  id: string;
  pageNumber: number;
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

interface ElementImageWithPage extends ElementType {
  pageId: string;
}

interface DocumentEditorProps {
  documentId: string;
}

const A4_WIDTH = 595; // Largura em pixels para 72 DPI
const A4_HEIGHT = 842; // Altura em pixels para 72 DPI

const DocumentEditor: React.FC<DocumentEditorProps> = ({ documentId }) => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [selectedElement, setSelectedElement] = useState<{
    pageId: string;
    elementId: string;
  } | null>(null);
  const [documentData, setDocumentData] = useState<DocumentDataCategory | null>(null); // Estado para armazenar o documento
  const { addToCart } = useCart(); // Função para adicionar ao carrinho
  const router = useRouter(); // Função do roteador para redirecionar

  // Função para carregar as páginas e os elementos
  const loadPages = async () => {
    try {
      const existingPages = await getPagesByDocumentId(documentId);
      const pagesWithElements = await Promise.all(
        existingPages.map(async (page) => {
          const elements = await getElementsByPageId(page.id);
          const formattedElements: ElementType[] = elements.map((element) => ({
            ...element,
            type: element.type as ElementType['type'],
            textType:
              element.textType === 'text' || element.textType === 'paragraph'
                ? element.textType
                : undefined,
          }));
          return { ...page, elements: formattedElements };
        })
      );

      setPages(pagesWithElements);
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
    }
  };

  // Função para carregar as informações do documento
  const loadDocumentData = async () => {
    try {
      const docData = await getDocumentById(documentId); // Chama o endpoint para obter as informações do documento
      setDocumentData(docData); // Armazena as informações no estado
    } catch (error) {
      console.error('Erro ao carregar documento:', error);
    }
  };

  useEffect(() => {
    loadPages();
    loadDocumentData(); // Carrega os dados do documento quando o componente é montado
  }, [documentId]);

  const allImages: ImageWithPage[] = pages.flatMap((page) =>
    page.elements
      .filter((el) => el.type === 'image')
      .map((el) => ({ ...el, pageId: page.id }))
  );

  const allElementImages: ElementImageWithPage[] = pages.flatMap((page) =>
    page.elements
      .filter((el) => el.type === 'elementImage')
      .map((el) => ({ ...el, pageId: page.id }))
  );

  const allTexts: TextWithPage[] = pages.flatMap((page) =>
    page.elements
      .filter((el) => el.type === 'text')
      .map((el) => ({ ...el, pageId: page.id }))
  );

  const allShapes = pages.flatMap((page) =>
    page.elements.filter((el) =>
      ['rectangle', 'square', 'circle', 'triangle'].includes(el.type)
    )
  );

  const allIcons: IconWithPage[] = pages.flatMap((page) =>
    page.elements
      .filter((el) => el.type === 'icon')
      .map((el) => ({ ...el, pageId: page.id }))
  );

  // Função para adicionar o documento ao carrinho
  const handleAddToCart = () => {
    if (documentData?.id) {
      addToCart(documentData.id);
    } else {
      console.error('Document ID is undefined');
    }
  };

  // Função para comprar o documento e redirecionar para o carrinho
  const handleBuyNow = () => {
    if (documentData?.id) {
      addToCart(documentData.id);
      router.push('/cart');
    } else {
      console.error('Document ID is undefined');
    }
  };

  return (
    <div className={styles.documentEditorContainer}>
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <div className={styles.pagesContainer}>
            {pages.map((pageData) => (
              <div key={pageData.id} className={styles.pageWrapper}>
                <Page
                  pageId={pageData.id}
                  width={A4_WIDTH}
                  height={A4_HEIGHT}
                  elements={pageData.elements}
                  selectedElement={selectedElement}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightPanel}>
          {/* Quadrado opaco sobre o conteúdo */}
          <div className={styles.overlay}></div>

          {/* Quadrado menor com informações do documento */}
          {documentData && (
            <div className={styles.categoryInfoBox}>
              <div className={styles.documentInfoBox}>
                <div className={styles.documentInfo}>
                  <h2 className={styles.documentTitle}>{documentData.title}</h2>
                  <p className={styles.documentPrice}>
                    {documentData.precoDesconto ? (
                      <>
                        <span className={styles.precoDesconto}>
                          R$ {documentData.precoDesconto}
                        </span>
                        <span className={styles.precoOriginal}>
                          R$ {documentData.preco}
                        </span>
                      </>
                    ) : (
                      <span>R$ {documentData.preco}</span>
                    )}
                  </p>
                  <p className={styles.documentAuthor}>{documentData.autor}</p>
                  <button
                    className={styles.buyButton}
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar o clique duplicado
                      handleBuyNow();
                    }}
                  >
                    Comprar
                  </button>
                  <button
                    className={styles.cartButton}
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar o clique duplicado
                      handleAddToCart();
                    }}
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          )}

          <TextList
            texts={allTexts}
            shapes={allShapes}
            icons={allIcons}
            images={allImages}
            selectedElement={selectedElement}
          />
          <button className={styles.downloadButton}>
            Fazer download em PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
