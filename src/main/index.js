const electron = require('electron');
const duckTray = require('./duck-tray');
const dnsUpdater = require('./dns-updater');
const platform = require('electron-platform');
const autoLauncher = require('./auto-launcher');
const configuration = require('./configuration');
const path = require('path');
const gd = require('./global-dir');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

gd.setGlobalDir();

let mainWindow;
let tray;

const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  if (platform.isDarwin) {
    app.dock.hide();
  }

  let isDev = process.env.NODE_ENV === 'development';
  mainWindow = new BrowserWindow({
    height: isDev ? 900 : 550,
    width: isDev ? 900 : 650,
    frame: false,
    resizable: isDev,
    show: isDev,
    skipTaskbar: true,
    webPreferences: { backgroundThrottling: false },
    icon: path.join(__static + '/assets/images/macicon.png')
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('blur', () => {
    mainWindow.hide();
  });

  app.on('window-all-closed', app.quit);

  tray = duckTray.init(mainWindow);
  configuration.init(mainWindow);

  autoLauncher.isEnabled().then(isEnabled => {
    currentConfig = configuration.readConfig();
    currentConfig.launchOnStartup = isEnabled;
    configuration.saveConfig(currentConfig);
  });
  
  dnsUpdater.start(configuration.readConfig(), mainWindow);
}

app.on('ready', createWindow);

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
