import React from 'react';
import { Info, Book, Settings, HelpCircle, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const InfoPage = ({ onGoBack }) => {
  const { state } = useAppContext();

  const infoSections = [
    {
      icon: <Info size={24} />,
      title: 'About Code Wallet',
      content: 'Code Wallet is a powerful snippet management application designed to help developers organize, store, and quickly access their code snippets.'
    },
    {
      icon: <Book size={24} />,
      title: 'How to Use',
      content: 'Create new snippets, add tags for organization, and use the search and filter features to quickly find the code you need.'
    },
    {
      icon: <Settings size={24} />,
      title: 'Features',
      content: '- Create and manage code snippets\n- Add custom tags\n- Dark/Light theme toggle\n- PDF and file import\n- Responsive design'
    },
    {
      icon: <HelpCircle size={24} />,
      title: 'Support',
      content: 'If you need help or have suggestions, please contact our support team.'
    }
  ];

  return (
    <div className={`w-full h-full p-6 overflow-y-auto ${state.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center mb-8">
        <button 
          onClick={onGoBack}
          className={`mr-4 p-2 rounded-full hover:bg-opacity-10 ${
            state.theme === 'dark' 
              ? 'hover:bg-white hover:bg-opacity-20' 
              : 'hover:bg-gray-200'
          }`}
        >
          <X size={24} />
        </button>
        <h1 className="text-3xl font-bold">Code Wallet Information</h1>
      </div>
      
      <div className="space-y-6">
        {infoSections.map((section, index) => (
          <div 
            key={index} 
            className={`p-5 rounded-lg ${
              state.theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="flex items-center mb-3">
              <div className={`mr-4 ${state.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                {section.icon}
              </div>
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoPage;