'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Stage,
  Layer,
  Rect,
  RegularPolygon,
  Circle,
  Image as KonvaImageElement,
  Text as KonvaTextElement,
  Transformer,
} from 'react-konva';
import useImage from 'use-image';
import styles from './Page.module.css';

export interface PageProps {
  pageId: string;
  width: number;
  height: number;
  elements: ElementType[];
  selectedElement: { pageId: string; elementId: string } | null;
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
}

const Page: React.FC<PageProps> = ({
  pageId,
  width,
  height,
  elements,
  selectedElement,
}) => {
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

      const newScale = Math.min(scaleX, scaleY);

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

  const TextElement: React.FC<{ el: ElementType }> = ({ el }) => {
    const fontStyle = `${el.bold ? 'bold' : ''} ${el.italic ? 'italic' : ''}`.trim();
    return (
      <>
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
        />
        {el.underline && (
          <Rect
            x={el.x}
            y={el.y + (el.fontSize || 16) + 2}
            width={(el.content?.length || 0) * (el.fontSize || 16) * 0.5}
            height={1}
            fill={el.fill || 'black'}
            listening={false}
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
      />
    );
  };

  const ShapeElement: React.FC<{ el: ElementType }> = ({ el }) => {
    const commonProps = {
      id: el.id,
      x: el.x,
      y: el.y,
      fill: el.fill || '#000000',
      rotation: el.rotation || 0,
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
      />
    );
  };

  return (
    <div className={styles.pageContainer} ref={containerRef}>
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        scaleX={scale.x}
        scaleY={scale.y}
      >
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill="white" listening={false} />

          {elements.map((el: ElementType) => {
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

          {selectedElement && selectedElement.pageId === pageId && (
            <Transformer
              ref={transformerRef}
              nodes={[stageRef.current.findOne('#' + selectedElement.elementId)]}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Page;
