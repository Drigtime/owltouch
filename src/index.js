import { app, BrowserWindow, dialog, ipcMain, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import { format as formatUrl } from 'url';

const en = require('./data/i18n/en/en');
const fr = require('./data/i18n/fr/fr');
const es = require('./data/i18n/es/es');

const path = require('path');

const iconPath = path.join(__dirname, 'icon.png');

let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 500,
    icon: iconPath,
    frame: false,
    backgroundColor: '#282c34',
  });
  // const window = new BrowserWindow({
  //   width: 1280,
  //   height: 720,
  //   minWidth: 700,
  //   minHeight: 500,
  //   frame: false,
  //   backgroundColor: '#282c34',
  // });

  window.loadURL(
    formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
    }),
  );

  window.on('closed', () => {
    mainWindow = null;
  });

  // window.webContents.on("devtools-opened", () => {
  //   window.focus();
  //   setImmediate(() => {
  //     window.focus();
  //   });
  // });

  // window.webContents.openDevTools();

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});

// ipcMain.on('languageChanged', (lng) => {
//   autoUpdater.downloadUpdate();
// });

const template = [
  {
    label: 'Fichier',
    submenu: [
      {
        label: 'Nouveau script',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow.webContents.send('newFile');
        },
      },
      {
        label: 'Sauvegarder',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          mainWindow.webContents.send('saveFile');
        },
      },
      {
        label: 'Charger un script',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          mainWindow.webContents.send('openFile');
        },
      },
      { label: 'Reload', role: 'reload' },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.webContents.toggleDevTools();
        },
      },
    ],
  },
  {
    label: 'Edition',
    submenu: [{ label: 'Annuler', role: 'undo' }, { label: 'Rétablir', role: 'redo' }],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

autoUpdater.autoDownload = false;

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available');
});

ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on('update-downloaded', () => {
  setImmediate(() => autoUpdater.quitAndInstall());
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded');
});

app.on('ready', () => {
  autoUpdater.checkForUpdates();
});

ipcMain.on('display-app-menu', (event, arg) => {
  const appMenu = Menu.buildFromTemplate(template);
  if (mainWindow) {
    appMenu.popup(mainWindow, arg.x, arg.y);
  }
});
