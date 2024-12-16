import { useRef } from 'react';
import type { Editor as TinyMCEEditor } from 'tinymce';

export function useEditor() {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const handleEditorInit = (_evt: any, editor: TinyMCEEditor) => {
    editorRef.current = editor;
    // Fix: Use the correct method to enable editing
    editor.setContent(editor.getContent());
    editor.getBody().contentEditable = 'true';
  };

  return {
    editorRef,
    handleEditorInit,
  };
}