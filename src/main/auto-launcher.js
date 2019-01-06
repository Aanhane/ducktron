const AutoLaunch = require('auto-launch');

const ducktronAutoLauncher = new AutoLaunch({
  name: 'Ducktron'
});

function enableAutoLaunch() {
  ducktronAutoLauncher
    .isEnabled()
    .then(function(isEnabled) {
      if (isEnabled) {
        return;
      }
      ducktronAutoLauncher.enable();
    })
    .catch(function(err) {
      // handle error
    });
}

function disableAutoLaunch() {
  ducktronAutoLauncher
    .isEnabled()
    .then(function(isEnabled) {
      if (!isEnabled) {
        return;
      }
      ducktronAutoLauncher.disable();
    })
    .catch(function(err) {
      // handle error
    });
}

function isEnabled() {
  return ducktronAutoLauncher
    .isEnabled()
    .then(function(isEnabled) {
      return isEnabled;
    })
    .catch(function(err) {
      // handle error
    });
}

module.exports = { enableAutoLaunch, disableAutoLaunch, isEnabled };
