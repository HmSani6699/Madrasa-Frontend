import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Undo, Redo, Image as ImageIcon } from 'lucide-react';

const RichTextEditor = ({ title, value, setValue, placeholder }) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setValue(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setValue(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    const handleDblClick = (e) => {
      if (e.target.tagName === 'IMG') {
        const currentWidth = e.target.style.width || e.target.width + 'px';
        const newWidth = prompt('Enter new image width (e.g., 50%, 300px):', currentWidth);
        if (newWidth) {
          e.target.style.width = newWidth;
          e.target.style.height = 'auto';
          handleInput(); // Save changes
        }
      }
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('dblclick', handleDblClick);
    }
    return () => {
      if (editor) editor.removeEventListener('dblclick', handleDblClick);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        executeCommand('insertImage', e.target.result);
        // Find the inserted image and add a helpful title
        if (editorRef.current) {
          const images = editorRef.current.getElementsByTagName('img');
          const lastImage = images[images.length - 1];
          if (lastImage) {
            lastImage.title = "Double-click to resize";
            lastImage.style.maxWidth = "100%";
            handleInput();
          }
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const ToolbarButton = ({ icon: Icon, onClick, title, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-emerald-100 transition-colors ${
        active ? 'bg-emerald-100 text-emerald-600' : 'text-slate-600'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="flex flex-col gap-2">
      {title && <label className="text-sm font-bold text-slate-700">{title}</label>}
      <div className="rounded-[8px] border border-slate-200 overflow-hidden bg-white shadow-sm focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500">
        {/* Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-1.5 flex flex-wrap gap-1 items-center">
          <ToolbarButton icon={Bold} onClick={() => executeCommand('bold')} title="Bold" />
          <ToolbarButton icon={Italic} onClick={() => executeCommand('italic')} title="Italic" />
          <ToolbarButton icon={Underline} onClick={() => executeCommand('underline')} title="Underline" />
          <div className="w-[1px] h-4 bg-slate-300 mx-1" />
          <ToolbarButton icon={List} onClick={() => executeCommand('insertUnorderedList')} title="Bullet List" />
          <ToolbarButton icon={ListOrdered} onClick={() => executeCommand('insertOrderedList')} title="Numbered List" />
          <div className="w-[1px] h-4 bg-slate-300 mx-1" />
          <ToolbarButton icon={Link} onClick={() => {
            const url = prompt('Enter URL:');
            if (url) executeCommand('createLink', url);
          }} title="Link" />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <ToolbarButton icon={ImageIcon} onClick={() => {
            fileInputRef.current?.click();
          }} title="Upload Image" />
          <div className="flex-1" />
          <ToolbarButton icon={Undo} onClick={() => executeCommand('undo')} title="Undo" />
          <ToolbarButton icon={Redo} onClick={() => executeCommand('redo')} title="Redo" />
        </div>

        {/* Editable Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          placeholder={placeholder}
          className="p-4 min-h-[150px] outline-none prose prose-sm max-w-none text-slate-800"
          style={{
            wordBreak: 'break-word',
          }}
        />
        {editorRef.current?.innerHTML === '' && (
          <div className="absolute top-0 left-0 p-4 text-slate-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
      <style>{`
        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: #94a3b8;
          cursor: text;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
