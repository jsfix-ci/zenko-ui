import React from 'react';
import MonacoEditor, { EditorProps } from '@monaco-editor/react';

type Props = {
  width?: string;
  height?: string;
  language?: string;
  value?: string;
  readOnly?: boolean;
  onChange: (data: React.ChangeEvent) => void;
} & EditorProps;

const Editor = ({
  height,
  width,
  language,
  value,
  onChange,
  readOnly,
  ...rest
}: Props) => (
  <MonacoEditor
    height={height}
    width={width}
    defaultLanguage={language}
    value={value}
    theme="vs-dark"
    loading="Initializing..."
    onChange={onChange}
    keepCurrentModel={true}
    saveViewState={false}
    options={{readOnly}}
    {...rest}
  />
);

export default Editor;
