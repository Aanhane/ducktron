const electron = require('electron');
const { ipcMain } = electron;
const dnsUpdater = require('./dns-updater');
const nconf = require('nconf');
const lodash = require('lodash');
const autoLauncher = require('./auto-launcher');

function init(mainWindow) {
  nconf.file({
    file: electron.app.getPath('userData') + '/ducktron-config.json'
  });

  ipcMain.on('save-config', (event, value) => {
    saveConfig(value);
    event.sender.send('save-config', readConfig());
    dnsUpdater.start(readConfig(), mainWindow);
  });

  ipcMain.on('get-config', event => {
    event.sender.send('get-config', readConfig());
  });

  ipcMain.on('enable-autolaunch', event => {
    autoLauncher.enableAutoLaunch();
  });

  ipcMain.on('disable-autolaunch', event => {
    autoLauncher.disableAutoLaunch();
  });
}

function readConfig() {
  nconf.load();

  let currentConfig = nconf.get('config');

  let defaults = {
    domains: [],
    refreshInterval: 60,
    smartUpdate: true
  };

  return lodash.defaults(currentConfig, defaults);
}

function saveConfig(settingValue) {
  nconf.set('config', settingValue);
  nconf.save();
}

module.exports = {
  init,
  saveConfig,
  readConfig
};
