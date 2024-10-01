// src/components/page/Page.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import styles from './Page.module.css'; 
import { v4 as uuidv4 } from 'uuid';

export interface PageProps {
  pageId: string;
  width: number;
  height: number;
  elements: ElementType[];
  onElementsChange: (
    pageId: string,
    updatedElement: ElementType | null,
    action: 'add' | 'update' | 'delete'
  ) => void;
  selectedElement: { pageId: string; elementId: string } | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<{ pageId: string; elementId: string } | null>>;
}

export interface ElementType {
  id: string;
  type: 'text' | 'image' | 'rectangle' | 'square' | 'circle' | 'triangle' | 'icon' | 'elementImage';
  x: number;
  y: number;
  content?: string;
  src?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fill?: string;
  width?: number;
  height?: number;
  rotation?: number;
  radius?: number;
  textType?: 'text' | 'paragraph';
  highlightColor?: string;
}

const Page: React.FC<PageProps> = ({
  pageId,
  width,
  height,
  elements,
  onElementsChange,
  selectedElement,
  setSelectedElement,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingElement, setEditingElement] = useState<ElementType | null>(null);
  const [textareaPosition, setTextareaPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState<{ x: number; y: number }>({ x: 1, y: 1 });

  const computeScale = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const scaleX = containerWidth / width;
      const scaleY = containerHeight / height;

      const newScale = Math.min(scaleX, scaleY, 1);

      setScale({ x: newScale, y: newScale });
    }
  };

  useEffect(() => {
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [width, height]);

  useEffect(() => {
    if (transformerRef.current) {
      if (selectedElement && selectedElement.pageId === pageId) {
        const stage = stageRef.current;
        const selectedNode = stage.findOne('#' + selectedElement.elementId);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer().batchDraw();
        }
      } else {
        transformerRef.current.detach();
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedElement, elements, pageId]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('elementType') as ElementType['type'];

    const textType = e.dataTransfer.getData('textType') as 'text' | 'paragraph';
    const imageSrc = e.dataTransfer.getData('imageSrc');
    const elementImageSrc = e.dataTransfer.getData('elementImageSrc'); // Novo
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
        fontSize: textType === 'paragraph' ? 14 : 16,
        bold: false,
        italic: false,
        underline: false,
        textType,
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
    } else if (type === 'elementImage' && elementImageSrc) { // Novo tratamento para 'elementImage'
      const img = new Image();
      img.src = elementImageSrc;
      img.onload = () => {
        const maxWidth = 300;
        const maxHeight = 300;
        let imgWidth = img.width;
        let imgHeight = img.height;

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
          src: elementImageSrc,
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedElement) {
        const pageId = selectedElement.pageId;
        const elementToDelete = elements.find((el: ElementType) => el.id === selectedElement.elementId);
        
        if (elementToDelete) {
          onElementsChange(pageId, elementToDelete, 'delete');
        }
        setSelectedElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, elements, pageId, onElementsChange, setSelectedElement]);

  const handleStageClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedElement(null);
    }
  };

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

  const TextElement: React.FC<{ el: ElementType }> = ({ el }) => {
    const fontStyle = `${el.bold ? 'bold' : ''} ${el.italic ? 'italic' : ''}`.trim();

    // Calcula a largura aproximada do texto com base no tamanho da fonte e no conteúdo
    const calculateTextWidth = (content: string | undefined, fontSize: number) => {
      if (!content) return 0;
      // Fator de escala para largura do texto com base na fonte e na média de largura das letras
      const averageCharWidth = fontSize * 0.5; 
      return content.length * averageCharWidth;
    };

    return (
      <>
        {/* Renderizando o texto */}
        <KonvaTextElement
          id={el.id}
          x={el.x}
          y={el.y}
          text={el.content || ''}
          fontSize={el.fontSize || 16}
          fontStyle={fontStyle}
          fill={el.fill || 'black'}
          width={el.textType === 'paragraph' ? width - el.x - 40 : undefined}
          align="left"
          draggable
          onClick={() => setSelectedElement({ pageId, elementId: el.id })}
          onTap={() => setSelectedElement({ pageId, elementId: el.id })}
          onDblClick={() => handleTextEdit(el)}
          onDragEnd={(e: KonvaEventObject<DragEvent>) => {
            const newX = e.target.x();
            const newY = e.target.y();
            if (el.x !== newX || el.y !== newY) {
              const updatedElement: ElementType = { ...el, x: newX, y: newY };
              onElementsChange(pageId, updatedElement, 'update');
            }
          }}
          onTransformEnd={(e: KonvaEventObject<MouseEvent>) => { // Adicionado
            const node = e.target;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);

            const updatedElement: ElementType = {
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              fontSize: el.fontSize ? el.fontSize * scaleY : 16,
              width: node.width() * scaleX,
              // Adicione outras propriedades conforme necessário
            };
            onElementsChange(pageId, updatedElement, 'update');
          }}
        />
        {/* Desenhando a linha de sublinhado */}
        {el.underline && (
          <Rect
            x={el.x}
            y={el.y + (el.fontSize || 16) + 2} // Posiciona a linha logo abaixo do texto
            width={calculateTextWidth(el.content, el.fontSize || 16)} // Calcula a largura com base no conteúdo
            height={1} // Altura da linha (espessura do sublinhado)
            fill={el.fill || 'black'}
            listening={false} // Não permite interações
          />
        )}
      </>
    );
  };

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
        onClick={() => setSelectedElement({ pageId, elementId: el.id })}
        onTap={() => setSelectedElement({ pageId, elementId: el.id })}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => {
          const newX = e.target.x();
          const newY = e.target.y();
          if (el.x !== newX || el.y !== newY) {
            const updatedElement: ElementType = { ...el, x: newX, y: newY };
            onElementsChange(pageId, updatedElement, 'update');
          }
        }}
        onTransformEnd={(e: KonvaEventObject<MouseEvent>) => { // Adicionado
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          const updatedElement: ElementType = {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          };
          onElementsChange(pageId, updatedElement, 'update');
        }}
      />
    );
  };

  const ElementImageElement: React.FC<{ el: ElementType }> = ({ el }) => { // Novo componente
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
        onClick={() => setSelectedElement({ pageId, elementId: el.id })}
        onTap={() => setSelectedElement({ pageId, elementId: el.id })}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => {
          const newX = e.target.x();
          const newY = e.target.y();
          if (el.x !== newX || el.y !== newY) {
            const updatedElement: ElementType = { ...el, x: newX, y: newY };
            onElementsChange(pageId, updatedElement, 'update');
          }
        }}
        onTransformEnd={(e: KonvaEventObject<MouseEvent>) => { // Adicionado
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          const updatedElement: ElementType = {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          };
          onElementsChange(pageId, updatedElement, 'update');
        }}
      />
    );
  };

  const ShapeElement: React.FC<{ el: ElementType }> = ({ el }) => {
    const commonProps = {
      id: el.id,
      x: el.x,
      y: el.y,
      fill: el.fill || '#000000',
      draggable: true,
      rotation: el.rotation || 0,
      onClick: () => setSelectedElement({ pageId, elementId: el.id }),
      onTap: () => setSelectedElement({ pageId, elementId: el.id }),
      onDragEnd: (e: KonvaEventObject<DragEvent>) => {
        const newX = e.target.x();
        const newY = e.target.y();
        if (el.x !== newX || el.y !== newY) {
          const updatedElement: ElementType = { ...el, x: newX, y: newY };
          onElementsChange(pageId, updatedElement, 'update');
        }
      },
      onTransformEnd: (e: KonvaEventObject<MouseEvent>) => { // Adicionado
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);

        let updatedElement: ElementType = { ...el, x: node.x(), y: node.y(), rotation: node.rotation() };

        switch (el.type) {
          case 'rectangle':
          case 'square':
            updatedElement.width = node.width() * scaleX;
            updatedElement.height = node.height() * scaleY;
            break;
          case 'circle':
            updatedElement.radius = el.radius ? el.radius * scaleX : 50 * scaleX;
            break;
          case 'triangle':
            updatedElement.radius = el.radius ? el.radius * scaleX : 50 * scaleX;
            break;
          default:
            break;
        }

        onElementsChange(pageId, updatedElement, 'update');
      },
    };

    switch (el.type) {
      case 'rectangle':
        return <Rect {...commonProps} width={el.width || 100} height={el.height || 100} />;
      case 'square':
        return <Rect {...commonProps} width={el.width || 100} height={el.width || 100} />;
      case 'circle':
        return <Circle {...commonProps} radius={el.radius || 50} />;
      case 'triangle':
        return <RegularPolygon {...commonProps} sides={3} radius={el.radius || 50} />;
      default:
        return null;
    }
  };

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
        onClick={() => setSelectedElement({ pageId, elementId: el.id })}
        onTap={() => setSelectedElement({ pageId, elementId: el.id })}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => {
          const newX = e.target.x();
          const newY = e.target.y();
          if (el.x !== newX || el.y !== newY) {
            const updatedElement: ElementType = { ...el, x: newX, y: newY };
            onElementsChange(pageId, updatedElement, 'update');
          }
        }}
        onTransformEnd={(e: KonvaEventObject<MouseEvent>) => { // Adicionado
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          const updatedElement: ElementType = {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          };
          onElementsChange(pageId, updatedElement, 'update');
        }}
      />
    );
  };

  return (
    <div
      className={styles.pageContainer} // Atualizado para usar CSS Modules
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      ref={containerRef}
    >
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        onClick={handleStageClick}
        onTap={handleStageClick}
        scale={scale}
      >
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill="white" listening={false} />

          {elements.map((el: ElementType) => {
            switch (el.type) {
              case 'text':
                return <TextElement key={el.id} el={el} />;
              case 'image':
                return <ImageElement key={el.id} el={el} />;
              case 'elementImage': // Novo caso para 'elementImage'
                return <ElementImageElement key={el.id} el={el} />;
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

          {selectedElement && selectedElement.pageId === pageId && (
            <Transformer
              ref={transformerRef}
              nodes={[stageRef.current.findOne('#' + selectedElement.elementId)]}
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
              boundBoxFunc={(oldBox, newBox) => newBox}
            />
          )}
        </Layer>
      </Stage>

      {isEditing && editingElement && (
        <textarea
          className={styles.textEditTextarea} // Atualizado para usar CSS Modules
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
    </div>
  );
};

export default Page;
