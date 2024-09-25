// src/components/CodeMirrorComponent.tsx
"use client";

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeMirrorComponentProps {
  value: string;
  onChange: (value: string) => void;
}

const CodeMirrorComponent: React.FC<CodeMirrorComponentProps> = ({ value, onChange }) => {
  return (
    <CodeMirror
      value={value}
      height="100%"
      width="100%"
      extensions={[html()]}
      theme={oneDark} // Aplica o tema escolhido
      onChange={(value) => onChange(value)}
    />
  );
};

export default CodeMirrorComponent;
