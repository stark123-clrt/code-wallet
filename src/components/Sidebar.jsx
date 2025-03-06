import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import DropZone from './DropZone'; 
import { Plus, Moon, Sun, Trash2, X, HelpCircle } from 'lucide-react';

const Sidebar = ({ 
  onNewSnippet, 
  onSelectTag, 
  selectedTag, 
  onShowInfo 
}) => {
  const { state, toggleTheme, addTag, deleteTag } = useAppContext();
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#61dafb');
  const [showTagForm, setShowTagForm] = useState(false);

  const handlePdfContent = (contentData) => {
    onNewSnippet({
      code: contentData.content,
      title: `${contentData.fileName}`,
      description: `Description ${contentData.fileName}`,
      tags: [], 
      language: contentData.language || 'text'
    });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTagName.trim()) {
      addTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setShowTagForm(false);
    }
  };

  // Fonction spécifique pour gérer le changement de nom de tag
  const handleTagNameChange = (e) => {
    setNewTagName(e.target.value);
  };

  // Reset form when opening it
  const toggleTagForm = () => {
    if (!showTagForm) {
      // Reset values when opening
      setNewTagName('');
      setNewTagColor('#61dafb');
    }
    setShowTagForm(!showTagForm);
  };

  return (
    <div className={`w-64 h-screen p-4 border-r flex flex-col ${state.theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Code Wallet</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={onShowInfo}
            className={`p-2 rounded-full ${state.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <HelpCircle size={20} />
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${state.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <button
        onClick={() => onNewSnippet()}
        className="w-full flex items-center justify-center py-2 px-4 mb-6 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        <Plus size={20} className="mr-2" /> New Snippet
      </button>

      <DropZone onPdfContent={handlePdfContent} />

      <div className="mb-4 flex flex-col flex-grow overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Tags</h2>
          <button
            onClick={toggleTagForm}
            className={`p-1 rounded-full ${state.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <Plus size={20} />
          </button>
        </div>

        {showTagForm && (
          <form onSubmit={handleAddTag} className="mb-3">
            <div className="flex mb-2">
              <input
                type="text"
                value={newTagName}
                onChange={handleTagNameChange}
                placeholder="Tag name"
                autoFocus
                className={`flex-1 p-1 text-sm rounded-l-md ${state.theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} border outline-none`}
              />
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-10 h-8 rounded-r-md border-l-0"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 py-1 px-3 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowTagForm(false)}
                className={`py-1 px-3 text-sm rounded-md ${state.theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-y-auto flex-grow">
          <div className="space-y-1">
            <button
              onClick={() => onSelectTag(null)}
              className={`w-full text-left py-1 px-2 rounded-md transition-colors ${selectedTag === null ? 'bg-blue-600 text-white' : state.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              All Tags
            </button>

            {state.tags.map(tag => (
              <div key={tag.id} className="flex items-center group">
                <button
                  onClick={() => onSelectTag(tag.name)}
                  className={`flex-1 flex items-center text-left py-1 px-2 rounded-md transition-colors ${selectedTag === tag.name ? 'bg-blue-600 text-white' : state.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  ></span>
                  {tag.name} ({state.snippets.filter(s => s.tags.includes(tag.name)).length})
                </button>
                <button
                  onClick={() => deleteTag(tag.id)}
                  className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${state.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;