"use strict";

import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import { autoUpdater } from "electron-updater";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
    const window = new BrowserWindow();
    window.setSize(1280, 720);
    window.setMinimumSize(700, 500);

    window.loadURL(
        formatUrl({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file",
            slashes: true
        })
    );

    window.on("closed", () => {
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
app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
    mainWindow = createMainWindow();
});

const template = [
    {
        label: "Fichier",
        submenu: [
            {
                label: "Nouveau script",
                accelerator: "CmdOrCtrl+N",
                click: () => {
                    mainWindow.webContents.send("newFile");
                }
            },
            {
                label: "Sauvegarder",
                accelerator: "CmdOrCtrl+S",
                click: () => {
                    mainWindow.webContents.send("saveFile");
                }
            },
            {
                label: "Charger un script",
                accelerator: "CmdOrCtrl+O",
                click: () => {
                    mainWindow.webContents.send("openFile");
                }
            },
            { label: "Reload", role: "reload" },
            { label: "toggle Dev Tools", role: "toggleDevTools" }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

autoUpdater.autoDownload = false;

autoUpdater.on("error", error => {
    dialog.showErrorBox("Error: ", error == null ? "unknown" : (error.stack || error).toString());
});

autoUpdater.on("update-available", () => {
    dialog.showMessageBox(
        {
            type: "info",
            title: "Nouvelle mise à jour touvé",
            message: "Nouvelle mise a jour touvé, voulez vous mettre a jour maintenant ?",
            buttons: ["Non", "Oui"]
        },
        buttonIndex => {
            if (buttonIndex === 1) {
                autoUpdater.downloadUpdate();
            }
        }
    );
});

autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox(
        {
            title: "Installation de mise à jours",
            message: "Mise à jours installé, quittez l'application pour appliquer les changements.",
            buttons: ["Plus tard", "Relancer maintenant"]
        },
        buttonIndex => {
            if (buttonIndex === 1) {
                setImmediate(() => autoUpdater.quitAndInstall());
            }
        }
    );
});

app.on("ready", () => {
    autoUpdater.checkForUpdates();
});
