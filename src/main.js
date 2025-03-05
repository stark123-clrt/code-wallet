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

// Variable globale pour la fenêtre principale
let mainWindow = null;

// Créer la fenêtre principale
const createWindow = () => {
  // Créer la fenêtre principale
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });


  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);


  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  // Ouvrir les DevTools en mode développement
  // mainWindow.webContents.openDevTools();
};

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

// Gestion de la fermeture de l'application
app.on('window-all-closed', () => {
  // Nettoyer correctement la fenêtre
  if (mainWindow) {
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.closeDevTools();
      mainWindow.removeAllListeners();
      mainWindow.close();
    }
    mainWindow = null;
  }


  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Gestion des événements avant la fermeture
app.on('before-quit', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.removeAllListeners();
    mainWindow.destroy();
  }
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  
  // Fermeture propre de l'application en cas d'erreur
  if (mainWindow) {
    mainWindow.close();
  }
  app.quit();
});