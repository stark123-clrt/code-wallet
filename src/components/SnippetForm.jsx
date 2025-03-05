// src/components/SnippetForm.jsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';
import { X } from 'lucide-react';

const LANGUAGES = [
    'javascript', 'typescript', 'html', 'css', 'python', 'java', 'c', 'cpp',
    'csharp', 'go', 'ruby', 'php', 'swift', 'kotlin', 'rust', 'sql', 'bash', 'json'
];

const SnippetForm = ({ snippet, onClose, onSave }) => {
    const { state, addSnippet, updateSnippet, addTag } = useAppContext();
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [newTagColor, setNewTagColor] = useState('#61dafb');

    // Initialiser le formulaire avec les données du snippet si on est en mode édition
    useEffect(() => {
        if (snippet) {
            setTitle(snippet.title);
            setCode(snippet.code);
            setLanguage(snippet.language);
            setDescription(snippet.description);
            setSelectedTags(snippet.tags);
        }
    }, [snippet]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim() || !code.trim()) {
            alert('Title and code are required!');
            return;
        }
        
        //Mise a jours d'un snippet

        if (snippet && snippet.id) {
            updateSnippet({
                ...snippet,
                title,
                code,
                language,
                description,
                tags: selectedTags,
            });
        } else {
            // Ajout un nouveau snippet 
            addSnippet({
                title,
                code,
                language,
                description,
                tags: selectedTags,
            });
        }

        onSave();
    };

    const handleAddTag = () => {
        if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
            const trimmedTag = newTag.trim();

            // Vérifier si le tag existe déjà dans le système
            const tagExists = state.tags.some(tag => tag.name === trimmedTag);

            // Si le tag n'existe pas, on le crée avec la couleur choisie
            if (!tagExists) {
                // Utiliser la couleur choisie par l'utilisateur
                addTag(trimmedTag, newTagColor);
            }

            // Ajouter le tag à la sélection du snippet actuel
            setSelectedTags([...selectedTags, trimmedTag]);
            setNewTag('');
            // Réinitialiser à la couleur par défaut pour le prochain tag
            setNewTagColor('#61dafb');
        }
    };

    const handleRemoveTag = (tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    const handleSelectExistingTag = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${state.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">
                        {snippet ? 'Edit Snippet' : 'New Snippet'}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full flex items-center justify-center ${state.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full px-3 py-2 rounded-md border ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            placeholder="Enter a title for your snippet"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full px-3 py-2 rounded-md border ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            placeholder="Describe what this code snippet does"
                            rows={2}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className={`w-full px-3 py-2 rounded-md border ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Code</label>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={`w-full px-3 py-2 rounded-md border font-mono ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            placeholder="Paste your code here"
                            rows={10}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedTags.map(tag => (
                                <span
                                    key={tag}
                                    className={`flex items-center px-3 py-1 rounded-full text-sm ${state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 p-0.5 rounded-full hover:bg-gray-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="flex">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className={`flex-grow px-3 py-2 rounded-l-md border ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                placeholder="Add a tag"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            />
                            <input
                                type="color"
                                value={newTagColor}
                                onChange={(e) => setNewTagColor(e.target.value)}
                                className="w-10 h-10 border-y border-r-0"
                                title="Choose tag color"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-3 py-2 rounded-r-md bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {state.tags && state.tags.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm mb-1">Existing tags:</p>
                                <div className="flex flex-wrap gap-1">
                                    {state.tags
                                        .filter(tag => !selectedTags.includes(tag.name))
                                        .map(tag => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => handleSelectExistingTag(tag.name)}
                                                className="px-2 py-0.5 text-xs rounded-full"
                                                style={{
                                                    backgroundColor: tag?.color + '33', // Add transparency
                                                    color: tag?.color
                                                }}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-md ${state.theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {snippet && snippet.id ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SnippetForm;