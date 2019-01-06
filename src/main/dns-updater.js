const https = require('https');
const publicIp = require('public-ip');
const axios = require('axios');

let intervalHandle;
let refreshTime;
let configuration;
let currentWindow;
let currentIpV4;
let previousRequestSuccessful;

function start(options, window) {
  stop();
  currentWindow = window;
  configuration = options;
  currentIpV4 = null;

  let intervalInMiliseconds = configuration.refreshInterval * 60000;
  refreshTime = new Date(new Date().getTime() + intervalInMiliseconds);
  intervalHandle = setInterval(() => {
    update();
  }, intervalInMiliseconds);
}

function stop() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
  }
}

function getRemainingMinutes() {
  return refreshTime ? (refreshTime.valueOf() - new Date().valueOf()) / 1000 / 60 : 0;
}

function update() {
  publicIp
    .v4()
    .then(ip => {
      let oldIp = currentIpV4;
      currentIpV4 = ip;
      if (oldIp === currentIpV4 && configuration.smartUpdate && previousRequestSuccessful) {
        sendUpdateMessage(true);
      } else {
        sendUpdate();
      }
    })
    .catch(() => {
      sendUpdate();
    });
}

function sendUpdate() {
  if (configuration.domains.length < 1) {
    sendUpdateMessage(false, 'No subdomain(s) configured');
  } else if (!configuration.token) {
    sendUpdateMessage(false, 'No token configured');
  } else {
    axios.default
      .get(
        `https://www.duckdns.org${encodeURI(
          `/update?domains=${configuration.domains.join(',')}&token=${configuration.token}`
        )}`
      )
      .then(res => {
        console.log({ res });
        console.log(res.data);
        if (res.status === 200) {
          if (
            res.data
              .toString()
              .trim()
              .startsWith('OK')
          ) {
            sendUpdateMessage(true);
          } else {
            sendUpdateMessage(false, `${res.data} (see https://www.duckdns.org/spec.jsp spec for more info)`);
          }
        } else {
          sendUpdateMessage(false, `${res.status} ${res.statusText}`);
        }
      })
      .catch(error => {
        console.log({ error });
        console.log(error.response.data);
        sendUpdateMessage(false, error.code);
      });
  }
}

function sendUpdateMessage(success, message) {
  currentWindow.webContents.send('dns-updated', {
    date: new Date(),
    success,
    message,
    currentIpV4
  });

  previousRequestSuccessful = success;
}

module.exports = {
  start,
  stop,
  getRemainingMinutes,
  update,
  sendUpdate
};
