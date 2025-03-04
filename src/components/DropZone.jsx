// src/components/DropZone.jsx
import React, { useState } from 'react';


const DropZone = ({ onPdfContent }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      if (file.name.toLowerCase().endsWith('.pdf')) {
        try {
          setIsLoading(true);
          
          // Lecture du fichier comme ArrayBuffer
          const arrayBuffer = await readFileAsArrayBuffer(file);
          
          // Envoi de l'ArrayBuffer au processus principal via IPC
          const pdfText = await window.api.extractPdfText(arrayBuffer);
          
          // Appeler la fonction de rappel avec le contenu
          if (onPdfContent && typeof onPdfContent === 'function') {
            onPdfContent({
              fileName: file.name,
              fileSize: file.size,
              content: pdfText || `[Le contenu de ${file.name} n'a pas pu être extrait]`
            });
          }
        } catch (error) {
          console.error('Erreur lors du traitement du PDF:', error);
          alert('Erreur lors du traitement du PDF. Veuillez réessayer.');
        } finally {
          setIsLoading(false);
        }
      } else {
        alert('Veuillez déposer un fichier PDF.');
      }
    }
  };

  // Fonction utilitaire pour lire un fichier comme ArrayBuffer
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
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
                ? 'Déposez le fichier PDF ici' 
                : 'Glissez et déposez un fichier PDF ici'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DropZone;