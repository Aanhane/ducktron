const electron= require('electron');
const { app, Menu, Tray, nativeImage } = electron;
const platform = require('electron-platform');
const dnsUpdater = require('./dns-updater');
const moment = require('moment');
const path = require('path');

let tray;
let mainWindow;
let trayMenu;

function init(window) {
  mainWindow = window;

  tray = createTray();
  trayMenu = createTrayMenu();
  tray.setContextMenu(trayMenu);
  console.log('binding click..');
  tray.on('click', onTrayClick);
  tray.on('right-click', onTrayClick);
  alignWindowToTray(window);

  trayMenu.on('menu-will-show', updateTrayMenu);

  setInterval(() => {
    updateTooltip();
  }, 1000);

  return tray;
}

function updateTrayMenu() {
  trayMenu = createTrayMenu();
  tray.setContextMenu(trayMenu);
  setTimeout(() => {
    tray.popUpContextMenu(trayMenu);
    trayMenu.on('menu-will-show', updateTrayMenu);
  }, 1);
}

function createTrayMenu() {
  let minutesBeforeUpdate = dnsUpdater.getRemainingMinutes();
  let remainingTimeLabel =
    minutesBeforeUpdate > 0
      ? `Next refresh ${moment().to(moment().add(Math.ceil(minutesBeforeUpdate), 'minutes'))}`
      : `Starting updater...`;
  let menu = Menu.buildFromTemplate([
    { id: 'refreshTime', label: remainingTimeLabel, type: 'normal', enabled: false },
    { type: 'separator' },
    { label: 'Open settings', type: 'normal', click: onSettingsClick },
    { label: 'Refresh now', type: 'normal', click: dnsUpdater.update },
    { type: 'separator' },
    { label: 'Quit', type: 'normal', click: onQuitClick }
  ]);
  return menu;
}

function alignWindowToTray(window) {
  const screenElectron = electron.screen;
  let ms = screenElectron.getPrimaryDisplay();
  const { width, height } = window.getBounds();

  let newX = ms.workArea.x != 0 ? ms.workArea.x : ms.workArea.width - width - 25;
  let newY = ms.workArea.y != 0 ? ms.workArea.y : ms.workArea.height - height - 25;

  window.setBounds({
    x: Math.floor(newX),
    y: Math.floor(newY),
    width,
    height
  });
}

function createTray() {
  var imageFolder = path.join(__static + '/assets/images/');
  let trayImage;
  if (platform.isDarwin) {
    trayImage = path.join(imageFolder + 'maciconTemplate.png');
  } else if (platform.isWin32) {
    trayImage = path.join(imageFolder + 'favicon.ico');
  }
  let trayIcon = nativeImage.createFromPath(trayImage);
  let newTray = new Tray(trayIcon);

  if (platform == 'darwin') {
    appIcon.setPressedImage(path.join(imageFolder + 'macicon-pressedTemplate.png'));
  }
  return newTray;
}

function onTrayClick() {
  mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
}

function onSettingsClick() {
  mainWindow.show();
}

function updateTooltip() {
  let minutesBeforeUpdate = dnsUpdater.getRemainingMinutes();
  let remainingTimeLabel =
    minutesBeforeUpdate > 0
      ? `Next refresh ${moment().to(moment().add(Math.ceil(minutesBeforeUpdate), 'minutes'))}`
      : `Starting updater...`;
  tray.setToolTip(remainingTimeLabel);
}

function onQuitClick() {
  app.exit();
}

module.exports = {
  init
};
