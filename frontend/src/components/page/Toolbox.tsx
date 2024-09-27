'use client';

import React, { useRef, useState } from 'react';
import styles from './Toolbox.module.css';

type IconType = {
  name: string;
  src: string;
};

const iconLibrary: IconType[] = [
  { name: 'Doc', src: 'https://img.icons8.com/?size=100&id=b0vfoq4G1DH5&format=png&color=000000' },
  { name: 'Close', src: 'https://img.icons8.com/?size=100&id=GhvBtzNnBL71&format=png&color=000000' },
  { name: 'Done', src: 'https://img.icons8.com/?size=100&id=n1nME5z0SPXi&format=png&color=000000' },
  { name: 'Trash', src: 'https://img.icons8.com/?size=100&id=UHHRzSA53Teo&format=png&color=000000' },
  { name: 'React', src: 'https://img.icons8.com/color/48/000000/react-native.png' },
];

const Toolbox: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shapeColor, setShapeColor] = useState<string>('#000000');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageUrl = event.target?.result;
        const imageDiv = document.getElementById('draggable-image');
        if (imageDiv && typeof imageUrl === 'string') {
          imageDiv.setAttribute('data-src', imageUrl);
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
          const imageSrc = e.currentTarget.getAttribute('data-src');
          if (imageSrc) {
            e.dataTransfer.setData('imageSrc', imageSrc);
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

      <div className={styles.toolboxIcons}>
        {iconLibrary.map((icon, index) => (
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

      <input
        type="color"
        className={styles.colorInput}
        value={shapeColor}
        onChange={(e) => setShapeColor(e.target.value)}
        title="Selecionar Cor"
      />

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
