import { useRef } from 'react';
import type { Editor as TinyMCEEditor } from 'tinymce';

export function useEditor() {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const handleEditorInit = (_evt: any, editor: TinyMCEEditor) => {
    editorRef.current = editor;
    // Initialize with the current content
    if (editor.getContent()) {
      editor.setContent(editor.getContent());
    }
    // Ensure the editor is editable
    editor.setMode('design');
  };

  return {
    editorRef,
    handleEditorInit,
  };
}