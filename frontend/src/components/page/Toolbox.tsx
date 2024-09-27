// src/components/Toolbox/Toolbox.tsx

'use client';

import React, { useRef, useState } from 'react';
import styles from './Toolbox.module.css';
import { iconLibrary, IconType } from './iconLibrary'; // Importando iconLibrary e IconType

const Toolbox: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const elementImageInputRef = useRef<HTMLInputElement>(null); // Novo ref para ElementImage
  const [shapeColor, setShapeColor] = useState<string>('#000000');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [elementImageSrc, setElementImageSrc] = useState<string | null>(null); // Novo estado para ElementImage

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const url = event.target?.result;
        if (url && typeof url === 'string') {
          setImageSrc(url);
          const imageDiv = document.getElementById('draggable-image');
          if (imageDiv) {
            imageDiv.setAttribute('data-src', url);
          }
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleElementImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { // Nova função de upload para ElementImage
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const url = event.target?.result;
        if (url && typeof url === 'string') {
          setElementImageSrc(url);
          const elementImageDiv = document.getElementById('draggable-element-image');
          if (elementImageDiv) {
            elementImageDiv.setAttribute('data-src', url);
          }
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePDF = () => {
    window.dispatchEvent(new Event('generate-pdf'));
  };

  return (
    <div className={styles.toolboxContainer}>
      {/* Itens de texto e formas existentes */}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('elementType', 'text');
          e.dataTransfer.setData('textType', 'text');
        }}
        className={styles.toolboxItem}
        title="Texto"
      >
        Texto
      </div>

      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('elementType', 'text');
          e.dataTransfer.setData('textType', 'paragraph');
        }}
        className={styles.toolboxItem}
        title="Parágrafo"
      >
        Parágrafo
      </div>

      <div
        id="draggable-image"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('elementType', 'image');
          const src = imageSrc || e.currentTarget.getAttribute('data-src');
          if (src) {
            e.dataTransfer.setData('imageSrc', src);
          } else {
            e.preventDefault();
            alert('Por favor, faça o upload de uma imagem primeiro.');
          }
        }}
        className={styles.toolboxItem}
        title="Imagem"
      >
        Imagem
      </div>

      {/* Novo elemento ElementImage */}
      <div
        id="draggable-element-image"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('elementType', 'elemetImage'); // Definido como 'elemetImage' conforme solicitado
          const src = elementImageSrc || e.currentTarget.getAttribute('data-src');
          if (src) {
            e.dataTransfer.setData('elementImageSrc', src);
          } else {
            e.preventDefault();
            alert('Por favor, faça o upload de uma ElementImage primeiro.');
          }
        }}
        className={styles.toolboxItem}
        title="ElementImage"
      >
        ElementImage
      </div>

      {/* Itens de formas */}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('elementType', 'rectangle');
          e.dataTransfer.setData('shapeColor', shapeColor);
        }}
        className={styles.toolboxItem}
        title="Retângulo"
      >
        Retângulo
      </div>

      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('elementType', 'square');
          e.dataTransfer.setData('shapeColor', shapeColor);
        }}
        className={styles.toolboxItem}
        title="Quadrado"
      >
        Quadrado
      </div>

      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('elementType', 'circle');
          e.dataTransfer.setData('shapeColor', shapeColor);
        }}
        className={`${styles.toolboxItem} ${styles.toolboxItemCircle}`}
        title="Círculo"
      >
        Círculo
      </div>

      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('elementType', 'triangle');
          e.dataTransfer.setData('shapeColor', shapeColor);
        }}
        className={`${styles.toolboxItem} ${styles.toolboxItemTriangle}`}
        title="Triângulo"
      >
        Triângulo
      </div>

      {/* Biblioteca de ícones */}
      <div className={styles.toolboxIcons}>
        {iconLibrary.map((icon: IconType, index: number) => (
          <img
            key={index}
            src={icon.src}
            alt={icon.name}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('elementType', 'icon');
              e.dataTransfer.setData('iconSrc', icon.src);
            }}
            className={styles.toolboxIcon}
            title={icon.name}
          />
        ))}
      </div>

      {/* Seletor de cor */}
      <input
        type="color"
        className={styles.colorInput}
        value={shapeColor}
        onChange={(e) => setShapeColor(e.target.value)}
        title="Selecionar Cor"
      />

      {/* Botão de upload de imagem existente */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={styles.uploadImageButton}
        title="Upload Image"
      >
        Upload Image
      </button>

      {/* Novo botão de upload para ElementImage */}
      <input
        type="file"
        accept="image/*"
        ref={elementImageInputRef}
        style={{ display: 'none' }}
        onChange={handleElementImageUpload}
      />
      <button
        onClick={() => elementImageInputRef.current?.click()}
        className={styles.uploadImageButton} // Pode ser alterado para uma classe distinta se desejar
        title="Upload ElementImage"
      >
        Upload ElementImage
      </button>

      {/* Botão para gerar PDF */}
      <button
        onClick={handleGeneratePDF}
        className={styles.generatePdfButton}
        title="Gerar PDF"
      >
        Gerar PDF
      </button>
    </div>
  );
};

export default Toolbox;
