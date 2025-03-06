import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import SnippetList from './components/SnippetList';
import SnippetDetail from './components/SnippetDetail';
import SnippetForm from './components/SnippetForm';
import InfoPage from './components/InfoPage';
import SplashScreen from './components/SplashScreen';

const AppContent = () => {
  const { state, deleteSnippet } = useAppContext(); 
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSnippetId, setSelectedSnippetId] = useState(null);
  const [showSnippetForm, setShowSnippetForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(undefined);
  const [showInfoPage, setShowInfoPage] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);

  // Récupérer le snippet sélectionné directement depuis le state pour avoir toujours la version à jour
  const selectedSnippet = selectedSnippetId 
    ? state.snippets.find(s => s.id === selectedSnippetId) 
    : null;

  const handleNewSnippet = (prefilledValues = undefined) => {
    if (prefilledValues) {
      setEditingSnippet({
        title: prefilledValues.title || '',
        code: prefilledValues.code || '',
        description: prefilledValues.description || '',
        language: prefilledValues.language || 'text',
        tags: prefilledValues.tags || [] 
      });
    } else {
      setEditingSnippet(undefined);
    }
    setShowSnippetForm(true);
    setShowInfoPage(false);
  };

  const handleEditSnippet = (snippet) => {
    setEditingSnippet(snippet);
    setShowSnippetForm(true);
    setShowInfoPage(false);
  };

  const handleCloseForm = () => {
    setShowSnippetForm(false);
    setEditingSnippet(undefined);
  };

  const handleSaveForm = () => {
    setShowSnippetForm(false);
    
    // Si nous étions en train d'éditer un snippet, assurons-nous qu'il reste sélectionné
    if (editingSnippet && editingSnippet.id) {
      setSelectedSnippetId(editingSnippet.id);
    }
    
    setEditingSnippet(undefined);
  };

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
    setSelectedSnippetId(null);
    setShowInfoPage(false);
  };

  const handleViewSnippet = (snippet) => {
    setSelectedSnippetId(snippet.id);
    setShowSnippetForm(false);
    setShowInfoPage(false);
  };

  const handleDeleteSnippet = (id) => {
    deleteSnippet(id);
    if (selectedSnippetId === id) {
      setSelectedSnippetId(null);
    }
  };

  const handleShowInfo = () => {
    setShowInfoPage(true);
  };

  const handleGoBack = () => {
    setShowInfoPage(false);
  };
  
  const handleSplashFinish = () => {
    setSplashFinished(true);
  };

  if (!splashFinished) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden ${state.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <Sidebar 
        onNewSnippet={handleNewSnippet} 
        onSelectTag={handleSelectTag}
        selectedTag={selectedTag}
        onShowInfo={handleShowInfo}
      />
      
      {showInfoPage ? (
        <div className="flex-1 overflow-hidden">
          <InfoPage onGoBack={handleGoBack} />
        </div>
      ) : (
        <>
          <SnippetList 
            selectedTag={selectedTag}
            onEditSnippet={handleEditSnippet}
            onViewSnippet={handleViewSnippet}
            onDeleteSnippet={handleDeleteSnippet}
            selectedSnippetId={selectedSnippetId}
          />
          
          {selectedSnippet ? (
            <SnippetDetail snippet={selectedSnippet} />
          ) : (
            <div className={`flex-1 flex flex-col items-center justify-center ${state.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
              <div className="text-6xl mb-4 opacity-20">📝</div>
              <h2 className="text-xl font-semibold mb-2">No Snippet Selected</h2>
              <p className={`${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                Select a snippet from the list<br />or create a new one
              </p>
            </div>
          )}
          
          {showSnippetForm && (
            <SnippetForm 
              snippet={editingSnippet} 
              onClose={handleCloseForm}
              onSave={handleSaveForm}
            />
          )}
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;