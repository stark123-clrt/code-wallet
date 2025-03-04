// src/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');


// Éviter les problèmes de démarrage sur Windows
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Chemins de fichiers pour le stockage
const USER_DATA_PATH = app.getPath('userData');
const SNIPPETS_FILE = path.join(USER_DATA_PATH, 'snippets.json');
const TAGS_FILE = path.join(USER_DATA_PATH, 'tags.json');
const pdfParse = require('pdf-parse');


// Créer la fenêtre principale
const createWindow = () => {
  // Créer la fenêtre principale
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  // Charger l'URL ou le fichier HTML
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);



}



// Configurer les gestionnaires IPC
function setupIpcHandlers() {
  // Charger les snippets
  ipcMain.handle('load-snippets', () => {
    try {
      if (!fs.existsSync(SNIPPETS_FILE)) {
        fs.writeFileSync(SNIPPETS_FILE, JSON.stringify([]));
        return [];
      }
      const data = fs.readFileSync(SNIPPETS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading snippets:', error);
      return [];
    }
  });

  // Sauvegarder les snippets
  ipcMain.handle('save-snippets', (_, snippets) => {
    try {
      fs.writeFileSync(SNIPPETS_FILE, JSON.stringify(snippets, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving snippets:', error);
      return false;
    }
  });

  // Charger les tags
  ipcMain.handle('load-tags', () => {
    try {
      if (!fs.existsSync(TAGS_FILE)) {
        fs.writeFileSync(TAGS_FILE, JSON.stringify([]));
        return [];
      }
      const data = fs.readFileSync(TAGS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading tags:', error);
      return [];
    }
  });

  // Sauvegarder les tags
  ipcMain.handle('save-tags', (_, tags) => {
    try {
      fs.writeFileSync(TAGS_FILE, JSON.stringify(tags, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving tags:', error);
      return false;
    }
  });

  // Ajoutez à vos gestionnaires IPC
ipcMain.handle('extract-pdf-text', async (_, arrayBuffer) => {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(Buffer.from(arrayBuffer));
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return null;
  }
});


}

// Initialiser l'application
app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});