import React, { useState } from 'react';

const DropZone = ({ onPdfContent }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Liste des extensions de fichiers de programmation à supporter
  const SUPPORTED_FILE_EXTENSIONS = [
    '.txt',  // Fichiers texte
    '.js',   // JavaScript
    '.jsx',  // React JavaScript
    '.ts',   // TypeScript
    '.tsx',  // React TypeScript
    '.py',   // Python
    '.json', // JSON
    '.html', // HTML
    '.css',  // CSS
    '.scss', // SCSS
    '.md',   // Markdown
    '.yml',  // YAML
    '.yaml', // YAML
    '.xml',  // XML
    '.sh',   // Shell script
    '.rb',   // Ruby
    '.php',  // PHP
    '.java', // Java
    '.cs',   // C#
    '.c',    // C
    '.cpp',  // C++
  ];

  // Gestion du survol de la zone de dépôt
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Gestion de la sortie du survol
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Fonction pour lire le contenu du fichier
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  // Gestion du dépôt de fichier
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // Vérifier si c'est un fichier supporté
      const isSupportedFile = SUPPORTED_FILE_EXTENSIONS.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );

      if (isSupportedFile) {
        try {
          setIsLoading(true);
          
          // Lire le contenu du fichier
          const fileText = await readFileAsText(file);
          
          // Détecter le langage en fonction de l'extension
          const getLanguage = (fileName) => {
            const ext = fileName.split('.').pop().toLowerCase();
            const languageMap = {
              'js': 'javascript',
              'jsx': 'jsx',
              'ts': 'typescript',
              'tsx': 'tsx',
              'py': 'python',
              'json': 'json',
              'html': 'html',
              'css': 'css',
              'scss': 'scss',
              'md': 'markdown',
              'yml': 'yaml',
              'yaml': 'yaml',
              'xml': 'xml',
              'sh': 'bash',
              'rb': 'ruby',
              'php': 'php',
              'java': 'java',
              'cs': 'csharp',
              'c': 'c',
              'cpp': 'cpp'
            };
            return languageMap[ext] || 'text';
          };

          // Appeler le callback avec les informations du fichier
          if (onPdfContent) {
            onPdfContent({
              fileName: file.name,
              fileSize: file.size,
              content: fileText,
              language: getLanguage(file.name)
            });
          }

        } catch (error) {
          console.error('Erreur lors du traitement du fichier:', error);
          alert('Erreur lors du traitement du fichier. Veuillez réessayer.');
        } finally {
          setIsLoading(false);
        }
      } else {
        alert('Veuillez déposer un fichier texte ou de programmation valide.');
      }
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 text-center my-4 transition-colors ${
        isDragging 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-700'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center h-32">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-gray-500">Extraction du contenu...</p>
          </div>
        ) : (
          <>
            <svg 
              className={`w-12 h-12 mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className={`mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-500'}`}>
              {isDragging 
                ? 'Déposez votre fichier ici' 
                : 'Glissez et déposez un fichier texte ou de programmation'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DropZone;