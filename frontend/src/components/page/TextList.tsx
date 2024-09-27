// src/components/page/TextList.tsx

import React, { useState, useRef, useEffect } from 'react';
import { ElementType } from './Page';
import './TextList.css';
import { ChromePicker } from 'react-color'; // Importando o ChromePicker

interface TextListProps {
  texts: ElementType[];
  shapes: ElementType[];
  onTextChange: (id: string, newText: string) => void;
  onShapeColorChange: (currentColor: string, newColor: string) => void;
}

const TextList: React.FC<TextListProps> = ({ texts, shapes, onTextChange, onShapeColorChange }) => {
  // Função para agrupar formas por cor
  const groupShapesByColor = (shapes: ElementType[]) => {
    const groups: { [color: string]: ElementType[] } = {};
    shapes.forEach(shape => {
      const color = shape.fill || '#000000'; // Default para preto se fill não estiver definido
      const normalizedColor = color.toLowerCase(); // Normalizar para evitar duplicatas por case
      if (!groups[normalizedColor]) {
        groups[normalizedColor] = [];
      }
      groups[normalizedColor].push(shape);
    });
    return groups;
  };

  const shapeGroups = groupShapesByColor(shapes);

  // Estado para controlar qual grupo está sendo editado
  const [activeColorGroup, setActiveColorGroup] = useState<string | null>(null);
  
  // Ref para o color picker
  const pickerRef = useRef<HTMLDivElement>(null);

  // Handler para cliques fora do color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setActiveColorGroup(null);
      }
    };

    if (activeColorGroup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeColorGroup]);

  return (
    <div className="text-list-container">
      <h3>Textos na Página</h3>
      {texts.length === 0 ? (
        <p>Nenhum texto adicionado ainda.</p>
      ) : (
        texts.map((text) => (
          <div key={text.id} className="text-list-item">
            <textarea
              value={text.content || ''}
              onChange={(e) => onTextChange(text.id, e.target.value)}
              className="text-list-textarea"
            />
          </div>
        ))
      )}

      <h3>Formas na Página</h3>
      {shapes.length === 0 ? (
        <p>Nenhuma forma adicionada ainda.</p>
      ) : (
        Object.keys(shapeGroups).map((color) => (
          <div key={color} className="shape-group">
            <div className="shape-group-header">
              <span className="shape-color-indicator" style={{ backgroundColor: color }}></span>
              <span className="shape-color-label">{color.toUpperCase()}</span>
              <button
                onClick={() => setActiveColorGroup(color)}
                className="shape-color-button"
                title={`Mudar cor de todas as formas com a cor ${color}`}
              >
                Alterar Cor
              </button>
            </div>

            {/* Renderizar o picker somente para o grupo ativo */}
            {activeColorGroup === color && (
              <div className="color-picker-popover">
                <div
                  className="color-picker-container"
                  ref={pickerRef}
                >
                  <ChromePicker
                    color={color}
                    onChangeComplete={(newColor) => onShapeColorChange(color, newColor.hex)}
                  />
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TextList;
