// src/components/page/DocumentEditor.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Toolbox from './Toolbox';
import Page, { ElementType } from './Page';
import TextList from './TextList';
import styles from './DocumentEditor.module.css';
import { v4 as uuidv4 } from 'uuid';
import {
  getPagesByDocumentId,
  createPage,
  deletePage as deletePageApi,
} from '../../services/pageService';
import {
  getElementsByPageId,
  createElement,
  deleteElement,
  updateElement,
} from '../../services/elementService';
import debounce from 'lodash.debounce'; // Import do debounce

// Definição das interfaces
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
  const [activeTab, setActiveTab] = useState<'editor' | 'cadastro'>('editor');
  const [isProcessing, setIsProcessing] = useState(false);

  // Função para carregar as páginas e os elementos
  const loadPages = async () => {
    try {
      const existingPages = await getPagesByDocumentId(documentId);
      const pagesWithElements = await Promise.all(
        existingPages.map(async (page) => {
          const elements = await getElementsByPageId(page.id);
          // Converter elementos de `Element` para `ElementType`
          const formattedElements: ElementType[] = elements.map((element) => ({
            ...element,
            type: element.type as ElementType['type'], // Converte o tipo de `string` para o tipo esperado
            textType:
              element.textType === 'text' || element.textType === 'paragraph'
                ? element.textType
                : undefined, // Mapeamento
          }));
          return { ...page, elements: formattedElements };
        })
      );

      if (pagesWithElements.length === 0) {
        const newPage = await createPage({ documentId, pageNumber: 0 });
        setPages([
          { id: newPage.id, pageNumber: newPage.pageNumber, elements: [] },
        ]);
      } else {
        setPages(pagesWithElements);
      }
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
    }
  };

  // useEffect para carregar as páginas ao montar o componente
  useEffect(() => {
    loadPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  // Função para adicionar uma nova página
  const addPage = async () => {
    try {
      const nextPageNumber = pages.length;
      const newPage = await createPage({
        documentId,
        pageNumber: nextPageNumber,
      });
      setPages((prev) => [
        ...prev,
        { id: newPage.id, pageNumber: newPage.pageNumber, elements: [] },
      ]);
    } catch (error) {
      console.error('Erro ao adicionar página:', error);
    }
  };

  // Função para excluir uma página
  const handleDeletePage = async (id: string) => {
    try {
      // Chama a API para deletar a página
      await deletePageApi(id);

      // Remove a página do estado local
      setPages((prev) => prev.filter((page) => page.id !== id));

      // Se a página excluída era a que estava selecionada, resetar o elemento selecionado
      if (selectedElement?.pageId === id) {
        setSelectedElement(null);
      }
    } catch (error) {
      console.error('Erro ao deletar página:', error);
    }
  };

  // Função para duplicar uma página
  const duplicatePage = (index: number) => {
    const originalPage = pages[index];
    const duplicatedElements = originalPage.elements.map((elem) => ({
      ...elem,
      id: uuidv4(),
    }));

    const newPageId = uuidv4();
    setPages((prev) => [
      ...prev,
      {
        id: newPageId,
        pageNumber: originalPage.pageNumber + 1,
        elements: duplicatedElements,
      },
    ]);
  };

  // Referência para debounce
  const debouncedUpdateElement = useRef(
    debounce(async (pageId: string, element: ElementType) => {
      try {
        await updateElement(element.id, element);
      } catch (error) {
        console.error('Erro ao atualizar elemento:', error);
        alert(`Erro ao atualizar elemento: ${(error as Error).message}`);
      }
    }, 500) // 500ms de atraso
  ).current;

  // Função para alterar o texto de um elemento e atualizar o backend
  const handleTextChange = (id: string, newText: string) => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          el.id === id && el.type === 'text'
            ? { ...el, content: newText }
            : el
        ),
      }))
    );

    // Busca a página que contém o elemento
    const page = pages.find((p) => p.elements.some((el) => el.id === id));

    if (page) {
      const element = page.elements.find((el) => el.id === id);
      if (element) {
        const updatedElement: ElementType = {
          ...element,
          content: newText,
        };
        debouncedUpdateElement(page.id, updatedElement);
      }
    } else {
      console.warn(`Página contendo o elemento com id ${id} não encontrada.`);
    }
  };

  // Função para alterar a formatação do texto de um elemento e atualizar o backend
  const handleTextFormatChange = (
    id: string,
    updatedText: Partial<ElementType>
  ) => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          el.id === id && el.type === 'text' ? { ...el, ...updatedText } : el
        ),
      }))
    );

    // Busca a página que contém o elemento
    const page = pages.find((p) => p.elements.some((el) => el.id === id));

    if (page) {
      const element = page.elements.find((el) => el.id === id);
      if (element) {
        const updatedElement: ElementType = {
          ...element,
          ...updatedText,
        };
        debouncedUpdateElement(page.id, updatedElement);
      }
    } else {
      console.warn(`Página contendo o elemento com id ${id} não encontrada.`);
    }
  };

  // Função para lidar com adição, atualização e deleção de elementos
  const handleElementChange = async (
    pageId: string,
    updatedElement: ElementType | null,
    action: 'add' | 'update' | 'delete'
  ) => {
    console.log(`Ação: ${action}, Elemento: `, updatedElement);

    if (isProcessing) return; // Evita que a operação seja executada enquanto outra está em andamento
    setIsProcessing(true); // Define a flag global

    try {
      if (action === 'add' && updatedElement) {
        // Verifica se o elemento já está em processo de criação para evitar duplicação
        const pageExists = pages.some(
          (p) =>
            p.id === pageId &&
            p.elements.some((el) => el.id === updatedElement.id)
        );
        if (!pageExists) {
          console.log('Adicionando elemento no backend:', updatedElement);
          const createdElement = await createElement({
            pageId,
            ...updatedElement,
          });
          console.log('Elemento criado:', createdElement);
          setPages((prevPages) =>
            prevPages.map((page) =>
              page.id === pageId
                ? {
                    ...page,
                    elements: [
                      ...page.elements,
                      createdElement as ElementType,
                    ],
                  }
                : page
            )
          );
        } else {
          console.warn('Elemento já existe:', updatedElement);
        }
      } else if (action === 'update' && updatedElement) {
        console.log('Atualizando elemento no backend:', updatedElement);
        const updated = await updateElement(updatedElement.id, updatedElement);
        console.log('Elemento atualizado:', updated);
        setPages((prevPages) =>
          prevPages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  elements: page.elements.map((el) =>
                    el.id === updated.id ? updated : el
                  ),
                }
              : page
          )
        );
      } else if (action === 'delete' && updatedElement) {
        console.log('Deletando elemento no backend:', updatedElement);
        await deleteElement(updatedElement.id);
        console.log('Elemento deletado:', updatedElement.id);
        setPages((prevPages) =>
          prevPages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  elements: page.elements.filter(
                    (el) => el.id !== updatedElement.id
                  ),
                }
              : page
          )
        );
      }
    } catch (error: any) {
      console.error(
        `Erro ao ${
          action === 'add'
            ? 'adicionar'
            : action === 'update'
            ? 'atualizar'
            : 'deletar'
        } elemento:`,
        error
      );
      alert(
        `Erro ao ${
          action === 'add'
            ? 'adicionar'
            : action === 'update'
            ? 'atualizar'
            : 'deletar'
        } elemento: ${error.message}`
      );
    } finally {
      setIsProcessing(false); // Libera para a próxima operação
    }
  };

  // Funções para alterar ícones, imagens e elementImages
  const handleIconChange = (
    pageId: string,
    elementId: string,
    newSrc: string
  ) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === pageId) {
          const updatedElements = page.elements.map((el) =>
            el.id === elementId && el.type === 'icon'
              ? { ...el, src: newSrc }
              : el
          );
          return { ...page, elements: updatedElements };
        }
        return page;
      })
    );

    // Atualizar o backend
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      const element = page.elements.find((el) => el.id === elementId);
      if (element) {
        const updatedElement: ElementType = {
          ...element,
          src: newSrc,
        };
        debouncedUpdateElement(pageId, updatedElement);
      }
    }
  };

  const handleImageChange = (
    pageId: string,
    elementId: string,
    newSrc: string
  ) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === pageId) {
          const updatedElements = page.elements.map((el) =>
            el.id === elementId && el.type === 'image'
              ? { ...el, src: newSrc }
              : el
          );
          return { ...page, elements: updatedElements };
        }
        return page;
      })
    );

    // Atualizar o backend
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      const element = page.elements.find((el) => el.id === elementId);
      if (element) {
        const updatedElement: ElementType = {
          ...element,
          src: newSrc,
        };
        debouncedUpdateElement(pageId, updatedElement);
      }
    }
  };

  const handleElementImageChange = (
    pageId: string,
    elementId: string,
    newSrc: string
  ) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === pageId) {
          const updatedElements = page.elements.map((el) =>
            el.id === elementId && el.type === 'elementImage'
              ? { ...el, src: newSrc }
              : el
          );
          return { ...page, elements: updatedElements };
        }
        return page;
      })
    );

    // Atualizar o backend
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      const element = page.elements.find((el) => el.id === elementId);
      if (element) {
        const updatedElement: ElementType = {
          ...element,
          src: newSrc,
        };
        debouncedUpdateElement(pageId, updatedElement);
      }
    }
  };

  const handleShapeColorChange = (currentColor: string, newColor: string) => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          ['rectangle', 'square', 'circle', 'triangle'].includes(el.type) &&
          el.fill === currentColor
            ? { ...el, fill: newColor }
            : el
        ),
      }))
    );

    // Atualizar o backend para cada forma alterada
    pages.forEach((page) => {
      page.elements.forEach((el) => {
        if (
          ['rectangle', 'square', 'circle', 'triangle'].includes(el.type) &&
          el.fill === currentColor
        ) {
          const updatedElement: ElementType = {
            ...el,
            fill: newColor,
          };
          debouncedUpdateElement(page.id, updatedElement);
        }
      });
    });
  };

  // Coletar todas as imagens das páginas
  const allImages: ImageWithPage[] = pages.flatMap((page) =>
    page.elements
      .filter((el) => el.type === 'image')
      .map((el) => ({ ...el, pageId: page.id }))
  );

  // Coletar todas as ElementImages das páginas
  const allElementImages: ElementImageWithPage[] = pages.flatMap((page) =>
    page.elements
      .filter((el) => el.type === 'elementImage')
      .map((el) => ({ ...el, pageId: page.id }))
  );

  // Coletar todas as textos das páginas
  const allTexts: TextWithPage[] = pages.flatMap((page) =>
    page.elements
      .filter((el) => el.type === 'text')
      .map((el) => ({ ...el, pageId: page.id }))
  );

  // Coletar todas as formas das páginas
  const allShapes = pages.flatMap((page) =>
    page.elements.filter((el) =>
      ['rectangle', 'square', 'circle', 'triangle'].includes(el.type)
    )
  );

  // Coletar todos os ícones das páginas
  const allIcons: IconWithPage[] = pages.flatMap((page) =>
    page.elements
      .filter((el) => el.type === 'icon')
      .map((el) => ({ ...el, pageId: page.id }))
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
                    onClick={() => handleDeletePage(pageData.id)} // Chama a função de deletar página
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
          <div className={styles.documentSelector}>
            <button
              onClick={() => console.log('Cadastrar funcionalidade')}
              className={styles.cadastrarButton}
            >
              Cadastrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
