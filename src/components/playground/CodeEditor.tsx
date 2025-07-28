// src/components/playground/CodeEditor.tsx
'use client';

import { usePlaygroundStore } from '@/store/use-playground-store';
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface CodeEditorProps {
  viewMode: 'code' | 'preview';
  setViewMode: (mode: 'code' | 'preview') => void;
}

export default function CodeEditor({ viewMode, setViewMode }: CodeEditorProps) {
  const { jsxCode, cssCode } = usePlaygroundStore();
  const [activeTab, setActiveTab] = useState<'jsx' | 'css'>('jsx');
  const [isClient, setIsClient] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCopy = () => {
    const codeToCopy = activeTab === 'jsx' ? jsxCode : cssCode;
    navigator.clipboard.writeText(codeToCopy || '').then(
      () => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      },
      () => {
        setCopySuccess('Failed!');
        setTimeout(() => setCopySuccess(''), 2000);
      }
    );
  };

  const handleDownload = () => {
    const zip = new JSZip();
    zip.file('Component.jsx', jsxCode || '');
    zip.file('styles.css', cssCode || '');
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'component.zip');
    });
  };

  const currentCode = activeTab === 'jsx' ? jsxCode : cssCode;
  const currentLanguage = activeTab === 'jsx' ? 'jsx' : 'css';

  return (
    <div className="bg-[#282a36] h-full flex flex-col rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-2 bg-[#21222C] border-b border-gray-700">
        <div className="flex items-center bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'code' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'preview' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-green-400 transition-opacity duration-300 w-16 text-center">
            {copySuccess}
          </span>
          <button
            onClick={handleCopy}
            title="Copy Code"
            className="p-2 rounded-md hover:bg-gray-700 text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={handleDownload}
            title="Download ZIP"
            className="p-2 rounded-md hover:bg-gray-700 text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('jsx')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'jsx'
              ? 'bg-[#282a36] text-white'
              : 'text-gray-400 bg-[#21222C]'
          }`}
        >
          Component.jsx
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'css'
              ? 'bg-[#282a36] text-white'
              : 'text-gray-400 bg-[#21222C]'
          }`}
        >
          styles.css
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        {isClient ? (
          <SyntaxHighlighter
            language={currentLanguage}
            style={dracula}
            customStyle={{ margin: 0, height: '100%', width: '100%' }}
            showLineNumbers
          >
            {currentCode || ''}
          </SyntaxHighlighter>
        ) : (
          <div className="p-4 text-gray-400">Loading code...</div>
        )}
      </div>
    </div>
  );
}
