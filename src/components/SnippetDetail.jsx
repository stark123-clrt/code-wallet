import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Eye, Copy, X } from 'lucide-react';


const SnippetDetail = ({ snippet }) => {
  const { state } = useAppContext();
  const codeRef = useRef(null);
  const fullCodeRef = useRef(null);
  const [showCodeViewer, setShowCodeViewer] = useState(false);

  useEffect(() => {
    if (snippet && codeRef.current) {
      codeRef.current.textContent = snippet.code;
      // Appliquer la coloration syntaxique si disponible
      if (window.hljs) {
        window.hljs.highlightElement(codeRef.current);
      }
    }
  }, [snippet]);

  useEffect(() => {
    // Mettre à jour la coloration syntaxique dans la vue complète quand elle s'ouvre
    if (showCodeViewer && fullCodeRef.current && snippet) {
      fullCodeRef.current.textContent = snippet.code;
      if (window.hljs) {
        window.hljs.highlightElement(fullCodeRef.current);
      }
    }
  }, [showCodeViewer, snippet]);

  const copyToClipboard = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
      alert('Code copied to clipboard!');
    }
  };

  // Version spécifique pour la vue complète
  const copyFromFullView = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
      alert('Code copied to clipboard!');
    }
  };

  if (!snippet) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center ${state.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="mb-4 opacity-20">📝</div>
        <h2 className="text-xl font-semibold mb-2">No Snippet Selected</h2>
        <p className={`${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Select a snippet from the list or create a new one
        </p>
      </div>
    );
  }

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
              {/* Remplacer le texte par une icône */}
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
          <pre className="p-4 overflow-y-auto max-h-80">
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

      {/* Visualiseur de code simplifié */}
      {showCodeViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-[95%] h-[95vh] overflow-hidden rounded-lg shadow-xl ${state.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            {/* En-tête simplifiée */}
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <h2 className="text-lg font-semibold">
                Code
              </h2>
              <div className="flex gap-2">
                {/* Remplacer les boutons textuels par des icônes */}
                <button 
                  onClick={copyFromFullView}
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
            
            {/* Zone de code avec défilement */}
            <div className="h-[calc(95vh-50px)] overflow-auto p-4">
              <pre className="h-full">
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