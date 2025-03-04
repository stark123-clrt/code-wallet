const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Vos APIs existantes...
  loadSnippets: () => ipcRenderer.invoke('load-snippets'),
  saveSnippets: (snippets) => ipcRenderer.invoke('save-snippets', snippets),
  loadTags: () => ipcRenderer.invoke('load-tags'),
  saveTags: (tags) => ipcRenderer.invoke('save-tags', tags),
  
});