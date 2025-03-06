import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Eye, Copy, X } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import 'highlight.js/styles/atom-one-light.css';

const highlightCode = (code, language) => {
  if (!code) return '';
  
  try {
    if (language) {
      return hljs.highlight(code, { language }).value;
    }
    // Otherwise, use auto-detection
    return hljs.highlightAuto(code).value;
  } catch (error) {
    console.error('Syntax highlighting error:', error);
    return code;
  }
};

// Get appropriate CSS class for dark/light mode
const getHighlightThemeClass = (isDarkMode) => {
  return isDarkMode ? 'atom-one-dark' : 'atom-one-light';
};

const SnippetDetail = ({ snippet }) => {
  const { state } = useAppContext();
  const codeRef = useRef(null);
  const fullCodeRef = useRef(null);
  const [showCodeViewer, setShowCodeViewer] = useState(false);

  useEffect(() => {
    hljs.configure({
      languages: [
        'javascript', 
        'typescript', 
        'python', 
        'ruby', 
        'java', 
        'html', 
        'css', 
        'php',
        'c',
        'cpp',
        'csharp',
        'go',
        'shell'
      ]
    });
  }, []);

  // Exécuter à chaque fois que le snippet ou ses propriétés changent
  useEffect(() => {
    if (snippet && codeRef.current) {
      const highlightedCode = highlightCode(snippet.code, snippet.language);
      codeRef.current.innerHTML = highlightedCode;
    }
  }, [snippet, snippet?.code, snippet?.language]); // Ajout des dépendances pour réagir aux changements

  // Update syntax highlighting in full view when opened
  useEffect(() => {
    if (showCodeViewer && fullCodeRef.current && snippet) {
      const highlightedCode = highlightCode(snippet.code, snippet.language);
      fullCodeRef.current.innerHTML = highlightedCode;
    }
  }, [showCodeViewer, snippet, snippet?.code, snippet?.language]); // Ajout des dépendances

  const copyToClipboard = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
      alert('Code copied to clipboard!');
    }
  };

  // Gérer le cas où snippet est null
  if (!snippet) return null;

  return (
    <div className={`flex-1 h-screen overflow-y-auto ${state.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{snippet.title}</h1>
          <p className={`mb-4 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {snippet.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {snippet.tags.map(tagName => {
              const tag = state.tags.find(t => t.name === tagName);
              return (
                <span 
                  key={tagName}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: tag?.color + '33',
                    color: tag?.color 
                  }}
                >
                  {tagName}
                </span>
              );
            })}
          </div>
        </div>
        
        <div className={`relative rounded-lg overflow-hidden ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className={`flex items-center justify-between px-4 py-2 ${state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <span className="text-sm font-medium">{snippet.language}</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowCodeViewer(true)}
                className={`flex items-center justify-center p-1.5 rounded-full ${state.theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title="Voir le code"
              >
                <Eye size={18} />
              </button>
              <button 
                onClick={copyToClipboard}
                className={`flex items-center justify-center p-1.5 rounded-full ${state.theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title="Copier le code"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
          <pre className={`p-4 overflow-y-auto max-h-80 ${getHighlightThemeClass(state.theme === 'dark')}`}>
            <code ref={codeRef} className={`language-${snippet.language}`}>
              {snippet.code}
            </code>
          </pre>
        </div>
        
        <div className={`mt-4 text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>Created: {new Date(snippet.createdAt).toLocaleString('fr-FR')}</p>
          <p>Last updated: {new Date(snippet.updatedAt).toLocaleString('fr-FR')}</p>
        </div>
      </div>

      {showCodeViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-[95%] h-[95vh] overflow-hidden rounded-lg shadow-xl ${state.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <h2 className="text-lg font-semibold">
                Code
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className={`flex items-center justify-center p-1.5 rounded-full ${state.theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  title="Copier le code"
                >
                  <Copy size={18} />
                </button>
                <button 
                  onClick={() => setShowCodeViewer(false)}
                  className={`flex items-center justify-center p-1.5 rounded-full ${state.theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  title="Fermer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="h-[calc(95vh-50px)] overflow-auto p-4">
              <pre className={`h-full ${getHighlightThemeClass(state.theme === 'dark')}`}>
                <code ref={fullCodeRef} className={`language-${snippet.language}`}>
                  {snippet.code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnippetDetail;