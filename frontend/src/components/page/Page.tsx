// src/components/page/Page.tsx

'use client';

import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  Stage,
  Layer,
  Rect,
  Transformer,
  RegularPolygon,
  Circle,
  Image as KonvaImageElement,
  Text as KonvaTextElement,
} from 'react-konva';
import useImage from 'use-image';
import { KonvaEventObject } from 'konva/lib/Node';
import jsPDF from 'jspdf';
import './Page.css';
import { v4 as uuidv4 } from 'uuid';

export interface PageProps {
  pageId: string;
  width: number;
  height: number;
  elements: ElementType[];
  onElementsChange: (pageId: string, updatedElement: ElementType | null, action: 'add' | 'update' | 'delete') => void;
}

export interface ElementType {
  id: string;
  type: 'text' | 'image' | 'rectangle' | 'square' | 'circle' | 'triangle' | 'icon';
  x: number;
  y: number;
  content?: string; // Para texto
  src?: string; // Para imagens e ícones
  fontSize?: number; // Para texto
  bold?: boolean; // Para texto
  italic?: boolean; // Para texto
  underline?: boolean; // Para texto
  fill?: string; // Para formas e texto
  width?: number; // Para imagens e formas
  height?: number; // Para imagens e formas
  rotation?: number; // Para todos os elementos
  radius?: number; // Para círculo e triângulo
  textType?: 'text' | 'paragraph'; // Diferencia tipos de texto
}

const Page: React.FC<PageProps> = ({
  pageId,
  width,
  height,
  elements,
  onElementsChange,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingElement, setEditingElement] = useState<ElementType | null>(null);
  const [textareaPosition, setTextareaPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estado para controlar a escala
  const [scale, setScale] = useState<{ x: number; y: number }>({ x: 1, y: 1 });

  // Função para calcular a escala baseada no tamanho do contêiner
  const computeScale = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Calcular a escala baseada na largura e altura disponíveis
      const scaleX = containerWidth / width;
      const scaleY = containerHeight / height;

      // Escolher o menor fator de escala para manter a proporção
      const newScale = Math.min(scaleX, scaleY, 1); // Não escala acima de 1

      setScale({ x: newScale, y: newScale });
    }
  };

  // Calcular a escala ao montar e ao redimensionar o contêiner
  useEffect(() => {
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [width, height]);

  // Atualizar o Transformer sempre que selectedId ou elements mudarem
  useEffect(() => {
    if (transformerRef.current) {
      if (selectedId) {
        const stage = stageRef.current;
        const selectedNode = stage.findOne('#' + selectedId);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer().batchDraw();
        }
      } else {
        transformerRef.current.detach();
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, elements]);

  // Handle drop de elementos na stage
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('elementType') as ElementType['type'];

    // Para textos, obter o tipo de texto
    const textType = e.dataTransfer.getData('textType') as 'text' | 'paragraph';

    const imageSrc = e.dataTransfer.getData('imageSrc');
    const shapeColor = e.dataTransfer.getData('shapeColor') || '#000000';
    const iconSrc = e.dataTransfer.getData('iconSrc');

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / scale.x;
    const y = (e.clientY - rect.top) / scale.y;

    if (type === 'text') {
      const newElement: ElementType = {
        id: uuidv4(),
        type,
        x,
        y,
        content: textType === 'paragraph' ? 'Novo parágrafo' : 'Novo texto',
        fontSize: textType === 'paragraph' ? 14 : 16, // Tamanho de fonte diferente para parágrafo
        bold: false,
        italic: false,
        underline: false,
        textType, // Armazenar o tipo de texto
      };
      onElementsChange(pageId, newElement, 'add');
    } else if (type === 'image' && imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const maxWidth = 300;
        const maxHeight = 300;
        let imgWidth = img.width;
        let imgHeight = img.height;

        // Redimensionar se necessário
        if (imgWidth > maxWidth) {
          const ratio = maxWidth / imgWidth;
          imgWidth = maxWidth;
          imgHeight = imgHeight * ratio;
        }
        if (imgHeight > maxHeight) {
          const ratio = maxHeight / imgHeight;
          imgHeight = maxHeight;
          imgWidth = imgWidth * ratio;
        }

        const newElement: ElementType = {
          id: uuidv4(),
          type,
          x,
          y,
          src: imageSrc,
          width: imgWidth,
          height: imgHeight,
        };
        onElementsChange(pageId, newElement, 'add');
      };
    } else if (['rectangle', 'square', 'circle', 'triangle'].includes(type)) {
      const defaultSize = type === 'square' ? 100 : type === 'circle' ? 50 : 100;
      const newElement: ElementType = {
        id: uuidv4(),
        type,
        x,
        y,
        fill: shapeColor,
        width: type === 'circle' ? undefined : defaultSize,
        height: type === 'circle' ? undefined : defaultSize,
        radius: type === 'circle' ? 50 : type === 'triangle' ? 50 : undefined,
      };
      onElementsChange(pageId, newElement, 'add');
    } else if (type === 'icon' && iconSrc) {
      const newElement: ElementType = {
        id: uuidv4(),
        type,
        x,
        y,
        src: iconSrc,
        width: 50,
        height: 50,
      };
      onElementsChange(pageId, newElement, 'add');
    }
  };

  // Iniciar edição de texto
  const handleTextEdit = (el: ElementType) => {
    const textNode = stageRef.current.findOne('#' + el.id);
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = containerRef.current?.getBoundingClientRect();

    if (!stageBox) return;

    setTextareaPosition({
      x: stageBox.left + textPosition.x * scale.x,
      y: stageBox.top + textPosition.y * scale.y,
    });
    setIsEditing(true);
    setEditingElement(el);
  };

  // Funções de formatação
  const toggleBold = () => {
    if (selectedId) {
      const element = elements.find(el => el.id === selectedId);
      if (element) {
        onElementsChange(pageId, { ...element, bold: !element.bold }, 'update');
      }
    }
  };

  const toggleItalic = () => {
    if (selectedId) {
      const element = elements.find(el => el.id === selectedId);
      if (element) {
        onElementsChange(pageId, { ...element, italic: !element.italic }, 'update');
      }
    }
  };

  const toggleUnderline = () => {
    if (selectedId) {
      const element = elements.find(el => el.id === selectedId);
      if (element) {
        onElementsChange(pageId, { ...element, underline: !element.underline }, 'update');
      }
    }
  };

  const changeFillColor = (color: string) => {
    if (selectedId) {
      const element = elements.find(el => el.id === selectedId);
      if (element) {
        onElementsChange(pageId, { ...element, fill: color }, 'update');
      }
    }
  };

  const changeFontSize = (size: number) => {
    if (selectedId) {
      const element = elements.find(el => el.id === selectedId);
      if (element) {
        onElementsChange(pageId, { ...element, fontSize: size }, 'update');
      }
    }
  };

  // Handle Delete key para remover elementos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) {
        const elementToDelete = elements.find(el => el.id === selectedId);
        if (elementToDelete) {
          onElementsChange(pageId, elementToDelete, 'delete');
        }
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, elements, pageId, onElementsChange]);

  // Handle click na stage para deselecionar
  const handleStageClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  // Escutar evento 'generate-pdf' para gerar PDF
  useEffect(() => {
    const handleGeneratePDF = () => {
      const pdf = new jsPDF('portrait', 'pt', 'a4');
      const stage = stageRef.current;
      if (stage) {
        const dataURL = stage.toDataURL({ pixelRatio: 2 });
        pdf.addImage(
          dataURL,
          'PNG',
          0,
          0,
          pdf.internal.pageSize.getWidth(),
          pdf.internal.pageSize.getHeight()
        );
        pdf.save('documento.pdf');
      }
    };

    window.addEventListener('generate-pdf', handleGeneratePDF as EventListener);
    return () => window.removeEventListener('generate-pdf', handleGeneratePDF as EventListener);
  }, []);

  // Componente separado para elementos de texto
  const TextElement: React.FC<{ el: ElementType }> = ({ el }) => {
    const fontStyle = `${el.bold ? 'bold' : ''} ${el.italic ? 'italic' : ''}`.trim();

    return (
      <KonvaTextElement
        id={el.id}
        x={el.x}
        y={el.y}
        text={el.content || ''}
        fontSize={el.fontSize || 16}
        fontStyle={fontStyle}
        underline={el.underline}
        fill={el.fill || 'black'}
        width={el.textType === 'paragraph' ? width - el.x - 40 : undefined} // Sem largura para 'text'
        align="left"
        draggable
        onClick={() => setSelectedId(el.id)}
        onTap={() => setSelectedId(el.id)}
        onDblClick={() => handleTextEdit(el)}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => {
          const updatedElement: ElementType = { ...el, x: e.target.x(), y: e.target.y() };
          onElementsChange(pageId, updatedElement, 'update');
        }}
        onTransformEnd={(e: KonvaEventObject<MouseEvent>) => {
          const node = e.target;
          const scaleY = node.scaleY();

          // Reset scale
          node.scaleX(1);
          node.scaleY(1);

          const updatedElement: ElementType = {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            fontSize: Math.max((el.fontSize || 16) * scaleY, 8), // Evita fontSize muito pequeno
          };
          onElementsChange(pageId, updatedElement, 'update');
        }}
      />
    );
  };

  // Componente separado para elementos de imagem
  const ImageElement: React.FC<{ el: ElementType }> = ({ el }) => {
    const [image] = useImage(el.src || '', 'anonymous');

    return (
      <KonvaImageElement
        id={el.id}
        x={el.x}
        y={el.y}
        image={image}
        width={el.width || 100}
        height={el.height || 100}
        rotation={el.rotation || 0}
        draggable
        onClick={() => setSelectedId(el.id)}
        onTap={() => setSelectedId(el.id)}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => {
          const updatedElement: ElementType = { ...el, x: e.target.x(), y: e.target.y() };
          onElementsChange(pageId, updatedElement, 'update');
        }}
        onTransformEnd={(e: KonvaEventObject<MouseEvent>) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale
          node.scaleX(1);
          node.scaleY(1);

          const updatedElement: ElementType = {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(node.width() * scaleX, 10), // Evita largura muito pequena
            height: Math.max(node.height() * scaleY, 10), // Evita altura muito pequena
          };
          onElementsChange(pageId, updatedElement, 'update');
        }}
      />
    );
  };

  // Componente separado para elementos de forma (retângulo, quadrado, círculo, triângulo)
  const ShapeElement: React.FC<{ el: ElementType }> = ({ el }) => {
    const commonProps = {
      id: el.id,
      x: el.x,
      y: el.y,
      fill: el.fill || '#000000',
      draggable: true,
      rotation: el.rotation || 0,
      onClick: () => setSelectedId(el.id),
      onTap: () => setSelectedId(el.id),
      onDragEnd: (e: KonvaEventObject<DragEvent>) => {
        const updatedElement: ElementType = { ...el, x: e.target.x(), y: e.target.y() };
        onElementsChange(pageId, updatedElement, 'update');
      },
      onTransformEnd: (e: KonvaEventObject<MouseEvent>) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale
        node.scaleX(1);
        node.scaleY(1);

        let updatedElement: ElementType = { ...el };

        if (el.type === 'circle') {
          updatedElement = {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            radius: Math.max((el.radius || 50) * scaleX, 10),
          };
        } else if (el.type === 'triangle') {
          updatedElement = {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            radius: Math.max((el.radius || 50) * scaleX, 10),
          };
        } else if (el.type === 'square') {
          const newSize = Math.max((el.width || 100) * scaleX, 10);
          updatedElement = {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: newSize,
            height: newSize,
          };
        } else if (el.type === 'rectangle') {
          updatedElement = {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max((el.width || 100) * scaleX, 10),
            height: Math.max((el.height || 100) * scaleY, 10),
          };
        }

        onElementsChange(pageId, updatedElement, 'update');
      },
    };

    switch (el.type) {
      case 'rectangle':
        return (
          <Rect
            {...commonProps}
            width={el.width || 100}
            height={el.height || 100}
          />
        );
      case 'square':
        return (
          <Rect
            {...commonProps}
            width={el.width || 100}
            height={el.width || 100} // Garante que a altura seja igual à largura
          />
        );
      case 'circle':
        return (
          <Circle
            {...commonProps}
            radius={el.radius || 50}
          />
        );
      case 'triangle':
        return (
          <RegularPolygon
            {...commonProps}
            sides={3}
            radius={el.radius || 50}
          />
        );
      default:
        return null;
    }
  };

  // Componente separado para elementos de ícone
  const IconElement: React.FC<{ el: ElementType }> = ({ el }) => {
    const [image] = useImage(el.src || '', 'anonymous');

    return (
      <KonvaImageElement
        id={el.id}
        x={el.x}
        y={el.y}
        image={image}
        width={el.width || 50}
        height={el.height || 50}
        rotation={el.rotation || 0}
        draggable
        onClick={() => setSelectedId(el.id)}
        onTap={() => setSelectedId(el.id)}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => {
          const updatedElement: ElementType = { ...el, x: e.target.x(), y: e.target.y() };
          onElementsChange(pageId, updatedElement, 'update');
        }}
        onTransformEnd={(e: KonvaEventObject<MouseEvent>) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale
          node.scaleX(1);
          node.scaleY(1);

          const updatedElement: ElementType = {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max((el.width || 50) * scaleX, 10),
            height: Math.max((el.height || 50) * scaleY, 10),
          };
          onElementsChange(pageId, updatedElement, 'update');
        }}
      />
    );
  };

  return (
    <div
      className="page-container"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      ref={containerRef} // Referência para o contêiner
    >
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        onClick={handleStageClick}
        onTap={handleStageClick}
        scale={scale} // Aplicar a escala calculada
      >
        <Layer>
          {/* Background com 'listening' desativado */}
          <Rect x={0} y={0} width={width} height={height} fill="white" listening={false} />

          {/* Renderizar elementos */}
          {elements.map((el) => {
            switch (el.type) {
              case 'text':
                return <TextElement key={el.id} el={el} />;
              case 'image':
                return <ImageElement key={el.id} el={el} />;
              case 'rectangle':
              case 'square':
              case 'circle':
              case 'triangle':
                return <ShapeElement key={el.id} el={el} />;
              case 'icon':
                return <IconElement key={el.id} el={el} />;
              default:
                return null;
            }
          })}

          {/* Transformer para redimensionar e rotacionar */}
          {selectedId && (
            <Transformer
              ref={transformerRef}
              nodes={[stageRef.current.findOne('#' + selectedId)]}
              enabledAnchors={[
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right',
                'middle-left',
                'middle-right',
                'top-center',
                'bottom-center',
              ]}
              rotateEnabled={true}
              boundBoxFunc={(oldBox, newBox) => newBox} // Permite redimensionamento livre
            />
          )}
        </Layer>
      </Stage>

      {/* Edição de Texto */}
      {isEditing && editingElement && (
        <textarea
          className="text-edit-textarea"
          style={{
            top: textareaPosition.y,
            left: textareaPosition.x,
            fontSize: editingElement.fontSize || 16,
            fontWeight: editingElement.bold ? 'bold' : 'normal',
            fontStyle: editingElement.italic ? 'italic' : 'normal',
            textDecoration: editingElement.underline ? 'underline' : 'none',
            color: editingElement.fill || 'black',
            transform: `rotate(${editingElement.rotation || 0}deg)`,
          }}
          value={editingElement.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newContent = e.target.value;
            setEditingElement({ ...editingElement, content: newContent });
          }}
          onBlur={() => {
            if (editingElement) {
              onElementsChange(pageId, editingElement, 'update');
              setIsEditing(false);
              setEditingElement(null);
            }
          }}
          autoFocus
        />
      )}

      {/* Barra de Formatação */}
      {selectedId && elements.find((el) => el.id === selectedId)?.type === 'text' && (
        <div
          className="formatting-bar"
          style={{
            top: textareaPosition.y - 40 * scale.y, // Posiciona acima do textarea com escala
            left: textareaPosition.x,
            transform: `scale(${1 / scale.x}, ${1 / scale.y})`, // Inverte a escala para manter o tamanho da barra
            transformOrigin: 'top left',
          }}
        >
          <button
            className={`formatting-button formatting-button-bold ${
              elements.find(el => el.id === selectedId)?.bold ? 'active' : ''
            }`}
            onClick={toggleBold}
            title="Negrito"
          >
            B
          </button>
          <button
            className={`formatting-button formatting-button-italic ${
              elements.find(el => el.id === selectedId)?.italic ? 'active' : ''
            }`}
            onClick={toggleItalic}
            title="Itálico"
          >
            I
          </button>
          <button
            className={`formatting-button formatting-button-underline ${
              elements.find(el => el.id === selectedId)?.underline ? 'active' : ''
            }`}
            onClick={toggleUnderline}
            title="Sublinhado"
          >
            U
          </button>
          <input
            type="color"
            className="color-input"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeFillColor(e.target.value)}
            value={elements.find((el) => el.id === selectedId)?.fill || '#000000'}
            title="Cor do Texto"
          />
          <input
            type="number"
            className="font-size-input"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeFontSize(Number(e.target.value))}
            value={elements.find((el) => el.id === selectedId)?.fontSize || 16}
            min={8}
            max={72}
            title="Tamanho da Fonte"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
