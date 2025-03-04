// src/App.jsx
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import SnippetList from './components/SnippetList';
import SnippetDetail from './components/SnippetDetail';
import SnippetForm from './components/SnippetForm';


const AppContent = () => {
  const { state, deleteSnippet } = useAppContext(); 
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [showSnippetForm, setShowSnippetForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(undefined);

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
  };

  const handleEditSnippet = (snippet) => {
    setEditingSnippet(snippet);
    setShowSnippetForm(true);
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
  };

  const handleViewSnippet = (snippet) => {
    setSelectedSnippet(snippet);
  };

  const handleDeleteSnippet = (id) => {
    deleteSnippet(id);
    if (selectedSnippet && selectedSnippet.id === id) {
      setSelectedSnippet(null);
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${state.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <Sidebar 
        onNewSnippet={handleNewSnippet} 
        onSelectTag={handleSelectTag}
        selectedTag={selectedTag}
      />
      <SnippetList 
        selectedTag={selectedTag}
        onEditSnippet={handleEditSnippet}
        onViewSnippet={handleViewSnippet}
        onDeleteSnippet={handleDeleteSnippet}
        selectedSnippetId={selectedSnippet ? selectedSnippet.id : null}
      />
      <SnippetDetail snippet={selectedSnippet} />
      
      {showSnippetForm && (
        <SnippetForm 
          snippet={editingSnippet} 
          onClose={handleCloseForm}
          onSave={handleSaveForm}
        />
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