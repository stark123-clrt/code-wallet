const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Évite les problèmes de démarrage sur Windows
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Déterminer si nous sommes en développement ou en production
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
// Détecter automatiquement la racine du projet
let STORAGE_PATH;

if (isDev) {
  // En développement, utiliser le répertoire de travail actuel
  STORAGE_PATH = process.cwd(); //répertoire de travail actuel
  console.log('Chemin de stockage (dev):', STORAGE_PATH);
} else {
  // En production, utiliser un dossier dans les données utilisateur
  STORAGE_PATH = path.join(app.getPath('userData'), 'data');
  
  // S'assurer que le dossier existe
  if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(STORAGE_PATH, { recursive: true });
  }
  console.log('Chemin de stockage (prod):', STORAGE_PATH);
}

// Chemins de fichiers pour le stockage
const SNIPPETS_FILE = path.join(STORAGE_PATH, 'snippets.json');
const TAGS_FILE = path.join(STORAGE_PATH, 'tags.json');

console.log('Fichier snippets sera à:', SNIPPETS_FILE);
console.log('Fichier tags sera à:', TAGS_FILE);

// Vérifier/créer les fichiers lors du démarrage
try {
  if (!fs.existsSync(SNIPPETS_FILE)) {
    fs.writeFileSync(SNIPPETS_FILE, JSON.stringify([]));
    console.log('Fichier snippets.json créé avec succès');
  }
  if (!fs.existsSync(TAGS_FILE)) {
    fs.writeFileSync(TAGS_FILE, JSON.stringify([]));
    console.log('Fichier tags.json créé avec succès');
  }
} catch (error) {
  console.error('Erreur lors de la création des fichiers JSON:', error);
}

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
  
  // Ajouter un handler pour obtenir le chemin de stockage
  ipcMain.handle('get-storage-path', () => {
    return STORAGE_PATH;
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