// src/components/page/Page.tsx

'use client';

import React, {
  useState,
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
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

// Define the type for icons as image URLs for simplicity
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

interface PageProps {
  width: number;
  height: number;
}

interface ElementType {
  id: string;
  type: 'text' | 'image' | 'rectangle' | 'square' | 'circle' | 'triangle' | 'icon';
  x: number;
  y: number;
  content?: string; // For text
  src?: string; // For images and icons
  fontSize?: number; // For text
  bold?: boolean; // For text
  italic?: boolean; // For text
  underline?: boolean; // For text
  fill?: string; // For shapes and text
  width?: number; // For images and shapes
  height?: number; // For images and shapes
  rotation?: number; // For all elements
  radius?: number; // For circle and triangle
}

const Page = forwardRef<any, PageProps>(({ width, height }, ref) => {
  const [elements, setElements] = useState<ElementType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingElement, setEditingElement] = useState<ElementType | null>(null);
  const [textareaPosition, setTextareaPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  // Expose stageRef to parent components (e.g., DocumentEditor)
  useImperativeHandle(ref, () => stageRef.current);

  // Update the Transformer whenever selectedId or elements change
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

  // Handle drop of elements onto the stage
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('elementType') as ElementType['type'];
    const imageSrc = e.dataTransfer.getData('imageSrc');
    const shapeColor = e.dataTransfer.getData('shapeColor') || '#000000';
    const iconSrc = e.dataTransfer.getData('iconSrc');
    const rect = stageRef.current.container().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (type === 'text') {
      const newElement: ElementType = {
        id: Date.now().toString(),
        type,
        x,
        y,
        content: 'Novo texto',
        fontSize: 16,
        bold: false,
        italic: false,
        underline: false,
      };
      setElements(prev => [...prev, newElement]);
    } else if (type === 'image' && imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const maxWidth = 300;
        const maxHeight = 300;
        let imgWidth = img.width;
        let imgHeight = img.height;

        // Resize if necessary
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
          id: Date.now().toString(),
          type,
          x,
          y,
          src: imageSrc,
          width: imgWidth,
          height: imgHeight,
        };
        setElements(prev => [...prev, newElement]);
      };
    } else if (['rectangle', 'square', 'circle', 'triangle'].includes(type)) {
      const defaultSize = type === 'square' ? 100 : type === 'circle' ? 50 : 100;
      const newElement: ElementType = {
        id: Date.now().toString(),
        type,
        x,
        y,
        fill: shapeColor,
        width: type === 'circle' ? undefined : defaultSize,
        height: type === 'circle' ? undefined : defaultSize,
        radius: type === 'circle' ? 50 : type === 'triangle' ? 50 : undefined,
      };
      setElements(prev => [...prev, newElement]);
    } else if (type === 'icon' && iconSrc) {
      const newElement: ElementType = {
        id: Date.now().toString(),
        type,
        x,
        y,
        src: iconSrc,
        width: 50,
        height: 50,
      };
      setElements(prev => [...prev, newElement]);
    }
  };

  // Start text editing
  const handleTextEdit = (el: ElementType) => {
    const textNode = stageRef.current.findOne('#' + el.id);
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();

    setTextareaPosition({
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    });
    setIsEditing(true);
    setEditingElement(el);
  };

  // Formatting functions
  const toggleBold = () => {
    if (selectedId) {
      const newElements = elements.map((elem) =>
        elem.id === selectedId
          ? { ...elem, bold: !elem.bold }
          : elem
      );
      setElements(newElements);
    }
  };

  const toggleItalic = () => {
    if (selectedId) {
      const newElements = elements.map((elem) =>
        elem.id === selectedId
          ? { ...elem, italic: !elem.italic }
          : elem
      );
      setElements(newElements);
    }
  };

  const toggleUnderline = () => {
    if (selectedId) {
      const newElements = elements.map((elem) =>
        elem.id === selectedId
          ? { ...elem, underline: !elem.underline }
          : elem
      );
      setElements(newElements);
    }
  };

  const changeFillColor = (color: string) => {
    if (selectedId) {
      const newElements = elements.map((elem) =>
        elem.id === selectedId
          ? { ...elem, fill: color }
          : elem
      );
      setElements(newElements);
    }
  };

  const changeFontSize = (size: number) => {
    if (selectedId) {
      const newElements = elements.map((elem) =>
        elem.id === selectedId
          ? { ...elem, fontSize: size }
          : elem
      );
      setElements(newElements);
    }
  };

  // Handle Delete key to remove elements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) {
        setElements(prev => prev.filter(elem => elem.id !== selectedId));
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  // Handle stage click to deselect
  const handleStageClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  // Listen to 'generate-pdf' event to generate PDF
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

  // Separate component for text elements
  const TextElement = ({ el }: { el: ElementType }) => {
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
        width={width - el.x - 20} // Ensure text wraps within page boundaries
        align="left"
        draggable
        onClick={() => setSelectedId(el.id)}
        onTap={() => setSelectedId(el.id)}
        onDblClick={() => handleTextEdit(el)}
        onDragEnd={(e: KonvaEventObject<DragEvent>) => {
          const newElements = elements.map((elem) =>
            elem.id === el.id
              ? { ...elem, x: e.target.x(), y: e.target.y() }
              : elem
          );
          setElements(newElements);
        }}
        onTransformEnd={(e: KonvaEventObject<MouseEvent>) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale
          node.scaleX(1);
          node.scaleY(1);

          const newElements = elements.map((elem) =>
            elem.id === el.id
              ? {
                  ...elem,
                  x: node.x(),
                  y: node.y(),
                  rotation: node.rotation(),
                  fontSize: (el.fontSize || 16) * scaleY,
                }
              : elem
          );
          setElements(newElements);
        }}
      />
    );
  };

  // Separate component for image elements
  const ImageElement = ({ el }: { el: ElementType }) => {
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
          const newElements = elements.map((elem) =>
            elem.id === el.id
              ? { ...elem, x: e.target.x(), y: e.target.y() }
              : elem
          );
          setElements(newElements);
        }}
        onTransformEnd={(e: KonvaEventObject<MouseEvent>) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale
          node.scaleX(1);
          node.scaleY(1);

          const newElements = elements.map((elem) =>
            elem.id === el.id
              ? {
                  ...elem,
                  x: node.x(),
                  y: node.y(),
                  rotation: node.rotation(),
                  width: node.width() * scaleX,
                  height: node.height() * scaleY,
                }
              : elem
          );
          setElements(newElements);
        }}
      />
    );
  };

  // Separate component for shape elements (rectangle, square, circle, triangle)
  const ShapeElement = ({ el }: { el: ElementType }) => {
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
        const newElements = elements.map((elem) =>
          elem.id === el.id
            ? { ...elem, x: e.target.x(), y: e.target.y() }
            : elem
        );
        setElements(newElements);
      },
      onTransformEnd: (e: KonvaEventObject<MouseEvent>) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale
        node.scaleX(1);
        node.scaleY(1);

        const newElements = elements.map((elem) => {
          if (elem.id === el.id) {
            if (elem.type === 'circle') {
              return {
                ...elem,
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                radius: (el.radius || 50) * scaleX,
              };
            } else if (elem.type === 'triangle') {
              return {
                ...elem,
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                radius: (el.radius || 50) * scaleX,
              };
            } else if (elem.type === 'square') {
              const newSize = (el.width || 100) * scaleX;
              return {
                ...elem,
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                width: newSize,
                height: newSize,
              };
            } else if (elem.type === 'rectangle') {
              return {
                ...elem,
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                width: (el.width || 100) * scaleX,
                height: (el.height || 100) * scaleY,
              };
            }
          }
          return elem;
        });
        setElements(newElements);
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
            height={el.width || 100} // Ensure height equals width
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

  // Separate component for icon elements
  const IconElement = ({ el }: { el: ElementType }) => {
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
          const newElements = elements.map((elem) =>
            elem.id === el.id
              ? { ...elem, x: e.target.x(), y: e.target.y() }
              : elem
          );
          setElements(newElements);
        }}
        onTransformEnd={(e: KonvaEventObject<MouseEvent>) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale
          node.scaleX(1);
          node.scaleY(1);

          const newElements = elements.map((elem) =>
            elem.id === el.id
              ? {
                  ...elem,
                  x: node.x(),
                  y: node.y(),
                  rotation: node.rotation(),
                  width: (el.width || 50) * scaleX,
                  height: (el.height || 50) * scaleY,
                }
              : elem
          );
          setElements(newElements);
        }}
      />
    );
  };

  // Listen to 'select-icon' event to add icons
  useEffect(() => {
    const handleIconSelect = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const iconSrc = customEvent.detail;
      if (iconSrc) {
        const newElement: ElementType = {
          id: Date.now().toString(),
          type: 'icon',
          x: 100,
          y: 100,
          src: iconSrc,
          width: 50,
          height: 50,
        };
        setElements(prev => [...prev, newElement]);
      }
    };

    window.addEventListener('select-icon', handleIconSelect as EventListener);
    return () => window.removeEventListener('select-icon', handleIconSelect as EventListener);
  }, []);

  return (
    <div
      className="page-container"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {/* Background */}
          <Rect x={0} y={0} width={width} height={height} fill="white" />

          {/* Render elements */}
          {elements.map((el) => {
            if (el.type === 'text') {
              return <TextElement key={el.id} el={el} />;
            } else if (el.type === 'image') {
              return <ImageElement key={el.id} el={el} />;
            } else if (['rectangle', 'square', 'circle', 'triangle'].includes(el.type)) {
              return <ShapeElement key={el.id} el={el} />;
            } else if (el.type === 'icon') {
              return <IconElement key={el.id} el={el} />;
            }
            return null;
          })}

          {/* Transformer for resizing and rotating */}
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
              boundBoxFunc={(oldBox, newBox) => newBox} // Allow free resizing
            />
          )}
        </Layer>
      </Stage>

      {/* Text Editing */}
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
          }}
          value={editingElement.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newContent = e.target.value;
            setEditingElement({ ...editingElement, content: newContent });
          }}
          onBlur={() => {
            if (editingElement) {
              const newElements = elements.map((elem) =>
                elem.id === editingElement.id ? editingElement : elem
              );
              setElements(newElements);
              setIsEditing(false);
              setEditingElement(null);
            }
          }}
          autoFocus
        />
      )}

      {/* Formatting Bar */}
      {selectedId && elements.find((el) => el.id === selectedId)?.type === 'text' && (
        <div
          className="formatting-bar"
          style={{
            top: textareaPosition.y - 40, // Position above the textarea
            left: textareaPosition.x,
          }}
        >
          <button
            className={`formatting-button formatting-button-bold ${elements.find(el => el.id === selectedId)?.bold ? 'active' : ''}`}
            onClick={toggleBold}
            title="Negrito"
          >
            B
          </button>
          <button
            className={`formatting-button formatting-button-italic ${elements.find(el => el.id === selectedId)?.italic ? 'active' : ''}`}
            onClick={toggleItalic}
            title="Itálico"
          >
            I
          </button>
          <button
            className={`formatting-button formatting-button-underline ${elements.find(el => el.id === selectedId)?.underline ? 'active' : ''}`}
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
});

export default Page;
