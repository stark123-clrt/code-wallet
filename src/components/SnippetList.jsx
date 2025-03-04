import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Edit, Trash2, X } from 'lucide-react';

const SnippetList = ({ selectedTag, onEditSnippet, onViewSnippet, onDeleteSnippet, selectedSnippetId }) => {
    const { state, deleteSnippet } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');

    // Filtrer les snippets en fonction du tag sélectionné et de la recherche
    const filteredSnippets = state.snippets.filter(snippet => {
        const matchesTag = selectedTag === null || snippet.tags.includes(selectedTag);
        const matchesSearch = searchQuery === '' ||
            snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snippet.code.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTag && matchesSearch;
    });

    // Trier les snippets par date de mise à jour (les plus récents en premier)
    const sortedSnippets = [...filteredSnippets].sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`w-80 h-screen flex flex-col ${state.theme === 'dark' ? 'bg-gray-800 text-white border-r border-gray-700' : 'bg-gray-50 text-gray-800 border-r border-gray-200'}`}>
            <div className="sticky top-0 z-10 bg-inherit p-4 pb-0">
                <div className={`flex items-center mb-4 px-3 py-2 rounded-md ${state.theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                    <input
                        type="text"
                        placeholder="Search snippets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full bg-transparent focus:outline-none ${state.theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
                    />
                </div>

                <h2 className="font-semibold mb-2 px-1">
                    {selectedTag ? `${selectedTag} Snippets` : 'All Snippets'} ({sortedSnippets.length})
                </h2>
            </div>

            <div className="overflow-y-auto flex-1">
                <div className="space-y-2 p-4 pt-0">
                    {sortedSnippets.length === 0 ? (
                        <p className={`text-center py-4 ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            No snippets found
                        </p>
                    ) : (
                        sortedSnippets.map(snippet => {
                            // Vérifier si ce snippet est celui affiché dans le panneau de détail
                            const isSelected = selectedSnippetId === snippet.id;

                            return (
                                <div
                                    key={snippet.id}
                                    className={`p-3 rounded-md cursor-pointer group ${isSelected
                                        ? (state.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200')
                                        : (state.theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100')
                                        } shadow-sm transition-colors`}
                                    onClick={() => onViewSnippet(snippet)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-medium truncate mr-2">{snippet.title}</h3>
                                        <div className={`flex space-x-1 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditSnippet(snippet);
                                                }}
                                                className={`p-1 rounded-full ${state.theme === 'dark' ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to delete this snippet?')) {
                                                        onDeleteSnippet(snippet.id);
                                                    }
                                                }}
                                                className={`p-1 rounded-full ${state.theme === 'dark' ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm truncate mb-2 text-gray-500">{snippet.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-1">
                                            {snippet.tags.slice(0, 3).map(tagName => {
                                                const tag = state.tags.find(t => t.name === tagName);
                                                return (
                                                    <span
                                                        key={tagName}
                                                        className="text-xs px-2 py-0.5 rounded-full"
                                                        style={{
                                                            backgroundColor: tag?.color + '33', // Add transparency
                                                            color: tag?.color
                                                        }}
                                                    >
                                                        {tagName}
                                                    </span>
                                                );
                                            })}
                                            {snippet.tags.length > 3 && (
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${state.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                                    +{snippet.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                            {formatDate(snippet.updatedAt)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default SnippetList;