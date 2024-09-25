// src/components/editor/Editor.tsx

"use client";

import React from 'react';
import styles from './Editor.module.css';

interface EditorProps {
  title: string;
  setTitle: (title: string) => void;
  paragraph: string;
  setParagraph: (paragraph: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  title,
  setTitle,
  paragraph,
  setParagraph,
}) => {
  return (
    <div className={styles.editorContainer}>
      <h3 className={styles.subtitle}>Configurações do Documento</h3>
      <div className={styles.inputGroup}>
        <label htmlFor="title">Título:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título aqui"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="paragraph">Parágrafo:</label>
        <textarea
          id="paragraph"
          value={paragraph}
          onChange={(e) => setParagraph(e.target.value)}
          placeholder="Digite o parágrafo aqui"
          rows={5}
        />
      </div>
    </div>
  );
};

export default Editor;
