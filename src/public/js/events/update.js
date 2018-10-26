import { ipcRenderer } from 'electron';
// import i18next from 'i18next';

ipcRenderer.on('update-available', () => {
  $('#updateAvailable').fadeIn();
});

ipcRenderer.on('update-downloaded', () => {
  $('#updateAvailable .card-content').html(`
    <span class="card-title" data-i18n="update.downloaded.title"></span>
    <p data-i18n="update.downloaded.content"></p>
    `);
  $('#updateAvailable .card-action').html(`
    <a class="btn waves-effect" data-i18n="update.downloaded.btn.confirm" id="downloadUpdateRestart"></a>
    <a class="btn-flat waves-effect" data-i18n="update.downloaded.btn.cancel" id="cancelUpdate"></a>
  `);
  $('#updateAvailable').localize();
  $('#downloadUpdateRestart').on('click', () => {
    ipcRenderer.send('update-downloaded');
  });
  $('#cancelUpdate').on('click', () => {
    $('#updateAvailable').fadeOut();
  });
});

$('#downloadUpdate').on('click', () => {
  ipcRenderer.send('download-update');
  $('#updateAvailable .card-content').html(`
  <span class="card-title" data-i18n="update.downloading.title"></span>
  <div class="progress"><div class="indeterminate"></div></div>
  <p data-i18n="update.downloading.comment"></p>
  `);
  $('#updateAvailable .card-action').html('');
  $('#updateAvailable').localize();
});

$('#cancelUpdate').on('click', () => {
  $('#updateAvailable').fadeOut();
});
