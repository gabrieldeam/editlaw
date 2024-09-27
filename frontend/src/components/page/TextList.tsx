// TextList.tsx

import React, { useRef, useEffect } from 'react';
import { ElementType } from './Page'; // Assegure-se de que esta interface esteja corretamente definida
import styles from './TextList.module.css'; // Usando CSS Modules
import { ChromePicker } from 'react-color';
import { iconLibrary, IconType } from './iconLibrary';

// Definição das interfaces
interface TextWithPage extends ElementType {
  pageId: string;
}

interface IconWithPage extends ElementType {
  pageId: string;
}

interface ImageWithPage extends ElementType {
  pageId: string;
}



interface TextListProps {
  texts: TextWithPage[];
  shapes: ElementType[];
  icons: IconWithPage[];
  images: ImageWithPage[]; // Adicionado para imagens
  onTextChange: (id: string, newText: string) => void;
  onShapeColorChange: (currentColor: string, newColor: string) => void;
  onTextFormatChange: (id: string, updatedText: Partial<ElementType>) => void;
  onIconChange: (
    pageId: string,
    elementId: string,
    newSrc: string
  ) => void;
  onImageChange: (
    pageId: string,
    elementId: string,
    newSrc: string
  ) => void; // Adicionado para trocar a fonte da imagem
  selectedElement: { pageId: string; elementId: string } | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<{ pageId: string; elementId: string } | null>>;
}

const TextList: React.FC<TextListProps> = ({
  texts,
  shapes,
  icons,
  images, // Recebendo imagens
  onTextChange,
  onShapeColorChange,
  onTextFormatChange,
  onIconChange,
  onImageChange, // Recebendo função de troca de imagens
  selectedElement,
  setSelectedElement,
}) => {
  // Agrupar formas por cor
  const groupShapesByColor = (shapes: ElementType[]) => {
    const groups: { [color: string]: ElementType[] } = {};
    shapes.forEach((shape) => {
      const color = shape.fill || '#000000';
      const normalizedColor = color.toLowerCase();
      if (!groups[normalizedColor]) {
        groups[normalizedColor] = [];
      }
      groups[normalizedColor].push(shape);
    });
    return groups;
  };

  const shapeGroups = groupShapesByColor(shapes);
  const [activeColorGroup, setActiveColorGroup] = React.useState<string | null>(null);
  const [activeIconGroup, setActiveIconGroup] = React.useState<string | null>(null);
  const [activeImageGroup, setActiveImageGroup] = React.useState<string | null>(null); // Estado para imagens
  const pickerRef = useRef<HTMLDivElement>(null);

  // Ref para input de upload de imagem
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setActiveColorGroup(null);
        setActiveIconGroup(null);
        setActiveImageGroup(null); // Fechar o picker de imagens ao clicar fora
      }
    };
    if (activeColorGroup || activeIconGroup || activeImageGroup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeColorGroup, activeIconGroup, activeImageGroup]);

  // Funções para formatação de texto
  const toggleBold = (id: string) => {
    const activeText = texts.find((t) => t.id === id);
    if (activeText) {
      onTextFormatChange(activeText.id, { bold: !activeText.bold });
    }
  };

  const toggleItalic = (id: string) => {
    const activeText = texts.find((t) => t.id === id);
    if (activeText) {
      onTextFormatChange(activeText.id, { italic: !activeText.italic });
    }
  };

  const toggleUnderline = (id: string) => {
    const activeText = texts.find((t) => t.id === id);
    if (activeText) {
      onTextFormatChange(activeText.id, { underline: !activeText.underline });
    }
  };

  const changeFillColor = (id: string, color: string) => {
    onTextFormatChange(id, { fill: color });
  };

  const changeFontSize = (id: string, size: number) => {
    onTextFormatChange(id, { fontSize: size });
  };

  // Funções para seleção e troca de ícones
  const handleIconSelection = (
    pageId: string,
    elementId: string,
    newSrc: string
  ) => {
    onIconChange(pageId, elementId, newSrc);
    setActiveIconGroup(null);
  };

  // Funções para seleção e troca de imagens
  const handleImageSelection = (
    pageId: string,
    elementId: string,
    newSrc: string
  ) => {
    onImageChange(pageId, elementId, newSrc);
    setActiveImageGroup(null);
  };

  // Função para lidar com upload de imagem
  const handleImageUpload = (pageId: string, elementId: string) => {
    setActiveImageGroup(elementId);
  };

  const onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    pageId: string,
    elementId: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataURL = reader.result as string;
        handleImageSelection(pageId, elementId, dataURL);
      };
      reader.readAsDataURL(file);
    }
    // Resetar o input
    e.target.value = '';
  };

  return (
    <div className={styles.textListContainer}>
      {/* Seção de Textos */}
      <h3>Textos na Página</h3>
      {texts.length === 0 ? (
        <p>Nenhum texto adicionado ainda.</p>
      ) : (
        texts.map((text) => {
          const isSelected =
            selectedElement?.pageId === text.pageId &&
            selectedElement.elementId === text.id;

          return (
            <div
              key={text.id}
              className={`${styles.textListItem} ${
                isSelected ? styles.selected : ''
              }`}
              onClick={() =>
                setSelectedElement({ pageId: text.pageId, elementId: text.id })
              }
            >
              {/* Aplicar as formatações */}
              <textarea
                value={text.content || ''}
                onChange={(e) => onTextChange(text.id, e.target.value)}
                className={styles.textListTextarea}
                style={{
                  fontSize: text.fontSize || 16,
                  fontWeight: text.bold ? 'bold' : 'normal',
                  fontStyle: text.italic ? 'italic' : 'normal',
                  textDecoration: text.underline ? 'underline' : 'none',
                  color: text.fill || 'black',
                }}
              />
              <div className={styles.formattingBar}>
                <button
                  className={`${styles.formattingButton} ${
                    text.bold ? styles.active : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBold(text.id);
                  }}
                  title="Negrito"
                >
                  B
                </button>
                <button
                  className={`${styles.formattingButton} ${
                    text.italic ? styles.active : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItalic(text.id);
                  }}
                  title="Itálico"
                >
                  I
                </button>
                <button
                  className={`${styles.formattingButton} ${
                    text.underline ? styles.active : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleUnderline(text.id);
                  }}
                  title="Sublinhado"
                >
                  U
                </button>
                <input
                  type="color"
                  className={styles.colorInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    {
                      e.stopPropagation();
                      changeFillColor(text.id, e.target.value);
                    }
                  }
                  value={text.fill || '#000000'}
                  title="Cor do Texto"
                />
                <input
                  type="number"
                  className={styles.fontSizeInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    {
                      e.stopPropagation();
                      changeFontSize(text.id, Number(e.target.value));
                    }
                  }
                  value={text.fontSize || 16}
                  min={8}
                  max={72}
                  title="Tamanho da Fonte"
                />
              </div>
              {/* Destaque se selecionado */}
              {isSelected && (
                <div className={styles.selectedOverlay}></div>
              )}
            </div>
          );
        })
      )}

      {/* Seção de Formas */}
      <h3>Formas na Página</h3>
      {shapes.length === 0 ? (
        <p>Nenhuma forma adicionada ainda.</p>
      ) : (
        Object.keys(shapeGroups).map((color) => (
          <div key={color} className={styles.shapeGroup}>
            <div className={styles.shapeGroupHeader}>
              <span
                className={styles.shapeColorIndicator}
                style={{ backgroundColor: color }}
              ></span>
              <span className={styles.shapeColorLabel}>
                {color.toUpperCase()}
              </span>
              <button
                onClick={() => setActiveColorGroup(color)}
                className={styles.shapeColorButton}
                title={`Mudar cor de todas as formas com a cor ${color}`}
              >
                Alterar Cor
              </button>
            </div>
            {activeColorGroup === color && (
              <div className={styles.colorPickerPopover}>
                <div
                  className={styles.colorPickerContainer}
                  ref={pickerRef}
                >
                  <ChromePicker
                    color={color}
                    onChangeComplete={(newColor) =>
                      onShapeColorChange(color, newColor.hex)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Seção de Ícones */}
      <h3>Ícones na Página</h3>
      {icons.length === 0 ? (
        <p>Nenhum ícone adicionado ainda.</p>
      ) : (
        icons.map((icon) => {
          const isSelected =
            selectedElement?.pageId === icon.pageId &&
            selectedElement.elementId === icon.id;

          return (
            <div
              key={icon.id}
              className={`${styles.iconListItem} ${
                isSelected ? styles.selected : ''
              }`}
              onClick={() =>
                setSelectedElement({ pageId: icon.pageId, elementId: icon.id })
              }
            >
              <img
                src={icon.src}
                alt="Icon"
                className={styles.iconImage}
                style={{
                  width: icon.width || 50,
                  height: icon.height || 50,
                  transform: `rotate(${icon.rotation || 0}deg)`,
                }}
              />
              <button
                className={styles.changeIconButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIconGroup(icon.id);
                }}
                title="Alterar Ícone"
              >
                Trocar Ícone
              </button>
              {activeIconGroup === icon.id && (
                <div className={styles.iconPickerPopover}>
                  <div
                    className={styles.iconPickerContainer}
                    ref={pickerRef}
                  >
                    {iconLibrary.map((libIcon) => (
                      <img
                        key={libIcon.name}
                        src={libIcon.src}
                        alt={libIcon.name}
                        className={styles.iconPickerImage}
                        onClick={() => {
                          handleIconSelection(
                            icon.pageId,
                            icon.id,
                            libIcon.src
                          );
                        }}
                        title={libIcon.name}
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* Destaque se selecionado */}
              {isSelected && (
                <div className={styles.selectedOverlay}></div>
              )}
            </div>
          );
        })
      )}

      {/* Seção de Imagens */}
      <h3>Imagens na Página</h3>
      {images.length === 0 ? (
        <p>Nenhuma imagem adicionada ainda.</p>
      ) : (
        images.map((image) => {
          const isSelected =
            selectedElement?.pageId === image.pageId &&
            selectedElement.elementId === image.id;

          return (
            <div
              key={image.id}
              className={`${styles.imageListItem} ${
                isSelected ? styles.selected : ''
              }`}
              onClick={() =>
                setSelectedElement({ pageId: image.pageId, elementId: image.id })
              }
            >
              <img
                src={image.src}
                alt="Image"
                className={styles.imageThumbnail}
                style={{
                  width: 100,
                  height:  100,
                }}
              />
              <button
                className={styles.changeImageButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageUpload(image.pageId, image.id);
                }}
                title="Alterar Imagem"
              >
                Trocar Imagem
              </button>
              {activeImageGroup === image.id && (
                <div className={styles.imagePickerPopover}>
                  <div
                    className={styles.imagePickerContainer}
                    ref={pickerRef}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        onFileChange(e, image.pageId, image.id);
                      }}
                    />
                    <p>Selecione uma imagem para upload:</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={styles.uploadButton}
                    >
                      Upload de Imagem
                    </button>
                  </div>
                </div>
              )}
              {/* Destaque se selecionado */}
              {isSelected && (
                <div className={styles.selectedOverlay}></div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default TextList;
