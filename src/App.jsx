import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import SnippetList from './components/SnippetList';
import SnippetDetail from './components/SnippetDetail';
import SnippetForm from './components/SnippetForm';
import InfoPage from './components/InfoPage';

const AppContent = () => {
  const { state, deleteSnippet } = useAppContext(); 
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [showSnippetForm, setShowSnippetForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(undefined);
  const [showInfoPage, setShowInfoPage] = useState(false);

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
    setEditingSnippet(undefined);
  };

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
    setSelectedSnippet(null);
    setShowInfoPage(false);
  };

  const handleViewSnippet = (snippet) => {
    setSelectedSnippet(snippet);
    setShowSnippetForm(false);
    setShowInfoPage(false);
  };

  const handleDeleteSnippet = (id) => {
    deleteSnippet(id);
    if (selectedSnippet && selectedSnippet.id === id) {
      setSelectedSnippet(null);
    }
  };

  const handleShowInfo = () => {
    setShowInfoPage(true);
  };

  const handleGoBack = () => {
    setShowInfoPage(false);
  };

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
            selectedSnippetId={selectedSnippet ? selectedSnippet.id : null}
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