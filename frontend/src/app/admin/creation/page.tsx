"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './creation.module.css'; // Importa os estilos
import CodeMirrorComponent from '../../../components/CodeMirrorComponent'; // Ajuste o caminho conforme sua estrutura

const CreationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cadastro' | 'editor' | 'easyeditor'>('cadastro');
  
  const [editorContent, setEditorContent] = useState<string>(`
<style>
  body {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    font-family: inherit;
    vertical-align: baseline;
    overflow: hidden;
  }
  .page {
    width: 21cm;
    height: 29.7cm;
    background-color: white;
    padding: 1cm;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
  }
  h1 {
    text-align: center;
  }
  p {
    text-align: justify;
  }
</style>
<body>
  <div class="page">
    <h1>Documento A4</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet tortor nec nunc tincidunt varius. Morbi finibus felis vitae lectus tristique, et sollicitudin sem faucibus. Sed et purus vitae metus malesuada porttitor.</p>
    <p>Vestibulum suscipit, nisi sed pharetra dignissim, libero erat pharetra ipsum, ac luctus lacus magna sit amet orci. Suspendisse potenti. Nam vehicula tortor quis dui sollicitudin, non vestibulum eros eleifend.</p>
  </div>
</body>
`);

  const iframeRef = useRef<HTMLIFrameElement>(null); // Referência para o iframe

  // Função para calcular e aplicar a escala
  const applyScale = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const body = doc.body;
        const iframeWidth = iframe.clientWidth;
        const iframeHeight = iframe.clientHeight;

        // Obter as dimensões reais do conteúdo
        const contentWidth = body.scrollWidth;
        const contentHeight = body.scrollHeight;

        // Calcula o fator de escala
        const scale = Math.min(iframeWidth / contentWidth, iframeHeight / contentHeight, 1);

        // Aplica a escala
        body.style.transform = `scale(${scale})`;
        body.style.transformOrigin = 'top left';
        body.style.width = `${contentWidth}px`;
        body.style.height = `${contentHeight}px`;
        body.style.overflow = 'hidden'; // Garante que não haja overflow
      }
    }
  };

  // Atualiza o iframe com o conteúdo do editor e aplica a escala
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        applyScale();
      };

      // Adiciona o listener de load
      iframe.addEventListener('load', handleLoad);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(editorContent);
        doc.close();
      }

      // Remove o listener ao desmontar
      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, [editorContent]);

  // Atualiza a escala quando o tamanho do iframe mudar
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resizeObserver = new ResizeObserver(() => {
      applyScale();
    });

    resizeObserver.observe(iframe);

    // Limpa o observador ao desmontar
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* Parte Esquerda */}
      <div className={styles.leftSection}>
        <div className={styles.leftSectionBox}>  
          <h2 className={styles.titlePreviewBox}>Visualização</h2>          
          <div className={styles.previewBox}>
            {/* Iframe para renderizar o HTML dinamicamente */}
            <iframe
              ref={iframeRef}
              className={styles.previewIframe}
              title="Editor Preview"
              frameBorder="0"
              sandbox="allow-scripts allow-same-origin" // Adicionado sandbox para segurança
            />
          </div>
        </div>
      </div>

      {/* Parte Direita */}
      <div className={styles.rightSection}>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.switchButton} ${activeTab === 'cadastro' ? styles.active : ''}`}
            onClick={() => setActiveTab('cadastro')}
          >
            Cadastro
          </button>
          <button
            className={`${styles.switchButton} ${activeTab === 'editor' ? styles.active : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </button>
          {/* Novo botão "Editor Fácil" */}
          <button
            className={`${styles.switchButton} ${activeTab === 'easyeditor' ? styles.active : ''}`}
            onClick={() => setActiveTab('easyeditor')}
          >
            Editor Fácil
          </button>
        </div>

        {/* Conteúdo Condicional com base no botão selecionado */}
        <div className={styles.content}>
          {activeTab === 'cadastro' && (
            <>
              <h2 className={styles.title}>Cadastro</h2>
              <p className={styles.text}>Aqui é a área de cadastro.</p>
            </>
          )}

          {activeTab === 'editor' && (
            <div className={styles.codeEditor}>
              {/* Editor CodeMirror */}
              <CodeMirrorComponent
                value={editorContent}
                onChange={setEditorContent} // Atualiza o estado com o conteúdo do editor
              />
            </div>
          )}

          {activeTab === 'easyeditor' && (
            <>
              <h2 className={styles.title}>Editor Fácil</h2>
              <p className={styles.text}>Aqui é a área de edição fácil.</p>
              {/* Você pode adicionar mais funcionalidades aqui para o editor fácil */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreationPage;
