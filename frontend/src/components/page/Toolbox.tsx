// src/components/page/Toolbox.tsx

'use client';

import React, { useRef, useState } from 'react';
import './Toolbox.css';

type IconType = {
  name: string;
  src: string;
};

// Predefined list of icons with image URLs
const iconLibrary: IconType[] = [
  { name: 'Beer', src: 'https://img.icons8.com/emoji/48/000000/beer-mug-emoji.png' },
  { name: 'Coffee', src: 'https://img.icons8.com/emoji/48/000000/hot-beverage-emoji.png' },
  { name: 'Apple', src: 'https://img.icons8.com/emoji/48/000000/apple-emoji.png' },
  { name: 'Android', src: 'https://img.icons8.com/emoji/48/000000/android-emoji.png' },
  { name: 'React', src: 'https://img.icons8.com/color/48/000000/react-native.png' },
];

const Toolbox: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shapeColor, setShapeColor] = useState<string>('#000000'); // Default color
  const [iconModalOpen, setIconModalOpen] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<IconType | null>(null);

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
    // Dispatch custom event to generate PDF
    window.dispatchEvent(new Event('generate-pdf'));
  };

  const openIconModal = () => {
    setIconModalOpen(true);
  };

  const closeIconModal = () => {
    setIconModalOpen(false);
  };

  const handleIconSelect = (icon: IconType) => {
    setSelectedIcon(icon);
    setIconModalOpen(false);
    // Dispatch custom event with icon image URL
    window.dispatchEvent(new CustomEvent('select-icon', { detail: icon.src }));
  };

  return (
    <div className="toolbox-container">
      {/* Text Tool */}
      <div
        draggable
        onDragStart={(e) => e.dataTransfer.setData('elementType', 'text')}
        className="toolbox-item"
        title="Texto"
      >
        Texto
      </div>

      {/* Image Tool */}
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
        className="toolbox-item"
        title="Imagem"
      >
        Imagem
      </div>

      {/* Shape Tools */}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('elementType', 'rectangle');
          e.dataTransfer.setData('shapeColor', shapeColor);
        }}
        className="toolbox-item"
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
        className="toolbox-item"
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
        className="toolbox-item toolbox-item-circle"
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
        className="toolbox-item toolbox-item-triangle"
        title="Triângulo"
      >
        Triângulo
      </div>

      {/* Icon Tool */}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('elementType', 'icon');
          // Icon URL will be sent via custom event upon selection in modal
        }}
        className="toolbox-item"
        onClick={openIconModal}
        title="Ícone"
      >
        Ícone
      </div>

      {/* Color Picker */}
      <input
        type="color"
        className="color-input"
        value={shapeColor}
        onChange={(e) => setShapeColor(e.target.value)}
        title="Selecionar Cor"
      />

      {/* Image Upload Button */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="upload-image-button"
        title="Upload Image"
      >
        Upload Image
      </button>

      {/* Generate PDF Button */}
      <button
        onClick={handleGeneratePDF}
        className="generate-pdf-button"
        title="Gerar PDF"
      >
        Gerar PDF
      </button>

      {/* Icon Selection Modal */}
      {iconModalOpen && (
        <div
          className="icon-modal"
          onClick={closeIconModal}
        >
          <div
            className="icon-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {iconLibrary.map((icon, index) => (
              <div
                key={index}
                onClick={() => handleIconSelect(icon)}
                className="icon-item"
                title={icon.name}
              >
                <img src={icon.src} alt={icon.name} className="icon-image" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbox;
