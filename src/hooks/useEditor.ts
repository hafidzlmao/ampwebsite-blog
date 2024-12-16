import { useRef, useEffect } from 'react';
import type { Editor as TinyMCEEditor } from 'tinymce';

export function useEditor() {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const handleEditorInit = (_evt: any, editor: TinyMCEEditor) => {
    console.log('Editor initialized:', editor);
    editorRef.current = editor;
    if (editor.getContent()) {
      editor.setContent(editor.getContent());
    }
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return {
    editorRef,
    handleEditorInit,
  };
}