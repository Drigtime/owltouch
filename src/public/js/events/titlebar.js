import { remote, ipcRenderer } from 'electron';
import loadScript from '../scripts/loadPath';
import { deleteAction, generateScript, icon, movementType } from '../scripts/pathMaker';

const { dialog } = require('electron').remote;
const { writeFile, readFile } = require('fs');

function deleteAll() {
  Object.keys(movementType).forEach((key) => {
    const dataTypeBackup = movementType[key].slice(0);
    movementType[key].forEach((index) => {
      icon.move.forEach((name) => {
        deleteAction(dataTypeBackup, index, name);
      });
    });
    movementType[key] = dataTypeBackup.slice(0);
  });
  console.log(movementType);
}


$('#minimize-button').on('click', () => {
  remote.getCurrentWindow().minimize();
});

$('#min-max-button').on('click', () => {
  const currentWindow = remote.getCurrentWindow();
  if (currentWindow.isMaximized()) {
    currentWindow.unmaximize();
  } else {
    currentWindow.maximize();
  }
});

$('#close-button').on('click', () => {
  remote.app.quit();
});

ipcRenderer.on('newFile', () => {
  const rep = confirm('Voulez vous vraiment créer un nouveau trajet et supprimer toute les actions présente sur la map ?');
  if (rep) {
    deleteAll();
  }
});

ipcRenderer.on('saveFile', () => {
  const config = {
    name: document.querySelector('#scriptName').value,
    type: document.querySelector('#scriptType').value,
    area: document.querySelector('#scriptArea').value,
  };
  dialog.showSaveDialog(
    {
      filters: [{ name: 'JavaScript', extensions: ['js'] }],
      defaultPath: `${config.name} [${config.area}][${config.type}]`,
    },
    (filename) => {
      if (filename) {
        writeFile(filename, generateScript(), (err) => {
          if (err) throw err;
          console.log(`${filename} Saved!`);
        });
      }
    },
  );
});

ipcRenderer.on('openFile', () => {
  dialog.showOpenDialog(
    {
      filters: [{ name: 'JavaScript', extensions: ['js'] }],
      properties: ['openFile'],
    },
    (filename) => {
      readFile(filename[0], 'utf8', (err, data) => {
        if (err) throw err;
        deleteAll();
        loadScript(data);
      });
    },
  );
});
