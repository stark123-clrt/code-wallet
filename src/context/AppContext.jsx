// src/context/AppContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Création du contexte
const AppContext = createContext(null);

// État initial
const initialState = {
  snippets: [],
  tags: [],
  theme: 'dark',
  selectedSnippetId: null // Ajoutez cette ligne
};

// Réducteur pour gérer les états
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_SNIPPETS':
      return { ...state, snippets: action.payload };
    
    case 'ADD_SNIPPET': {
      const newSnippet = {
        id: crypto.randomUUID(),
        title: action.payload.title || '',
        code: action.payload.code || '',
        language: action.payload.language || 'javascript',
        description: action.payload.description || '',
        tags: action.payload.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { ...state, snippets: [...state.snippets, newSnippet] };
    }
    
    case 'UPDATE_SNIPPET': {
      const updatedSnippet = {
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedSnippets = state.snippets.map(snippet => 
        snippet.id === updatedSnippet.id ? updatedSnippet : snippet
      );
      
      return { ...state, snippets: updatedSnippets };
    }
    
    case 'DELETE_SNIPPET': {
      const updatedSnippets = state.snippets.filter(
        snippet => snippet.id !== action.payload
      );
      
      return { ...state, snippets: updatedSnippets };
    }
    
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
      
    case 'ADD_TAG': {
      const newTag = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        color: action.payload.color,
      };
      
      return { ...state, tags: [...state.tags, newTag] };
    }
    
    case 'DELETE_TAG': {
      const updatedTags = state.tags.filter(tag => tag.id !== action.payload);
      return { ...state, tags: updatedTags };
    }

    case 'SET_SELECTED_SNIPPET': {
      return { ...state, selectedSnippetId: action.payload };
    }
    
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
      
    default:
      return state;
  }
}

// Fournisseur du contexte
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Actions exposées
  const addSnippet = (snippet) => {
    dispatch({ type: 'ADD_SNIPPET', payload: snippet });
  };
  
  const updateSnippet = (snippet) => {
    dispatch({ type: 'UPDATE_SNIPPET', payload: snippet });
  };
  
  const deleteSnippet = (id) => {
    dispatch({ type: 'DELETE_SNIPPET', payload: id });
  };
  
  const addTag = (name, color) => {
    dispatch({ type: 'ADD_TAG', payload: { name, color } });
  };
  
  const deleteTag = (id) => {
    dispatch({ type: 'DELETE_TAG', payload: id });
  };
  
  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };
  
  // À implémenter: chargement/sauvegarde des données avec electron
  // Quand vous serez prêt à ajouter la persistance
 // Dans AppContext.jsx, modifiez la partie useEffect
useEffect(() => {
    // Charger les données réelles au lieu de la démo
    const loadData = async () => {
      try {
        // Utiliser les API Electron pour charger les données
        const snippets = await window.api.loadSnippets();
        const tags = await window.api.loadTags();
        
        dispatch({ type: 'SET_SNIPPETS', payload: snippets });
        dispatch({ type: 'SET_TAGS', payload: tags });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Charger les données de démo en cas d'erreur
        dispatch({ type: 'SET_SNIPPETS', payload: demoSnippets });
        dispatch({ type: 'SET_TAGS', payload: demoTags });
      }
    };
    
    loadData();
  }, []);
  
  // Ajouter un effet pour sauvegarder les données quand elles changent
  useEffect(() => {
    if (state.snippets.length > 0) {
      window.api.saveSnippets(state.snippets).catch(err => 
        console.error('Erreur lors de la sauvegarde des snippets:', err)
      );
    }
  }, [state.snippets]);
  
  useEffect(() => {
    if (state.tags.length > 0) {
      window.api.saveTags(state.tags).catch(err => 
        console.error('Erreur lors de la sauvegarde des tags:', err)
      );
    }
  }, [state.tags]);
  
  return (
    <AppContext.Provider
      value={{
        state,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        addTag,
        deleteTag,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};