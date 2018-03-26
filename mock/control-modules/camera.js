const speed = 500

function setup (mockParams, registerCmd) {
  function onCamera ({ offset }) {
    console.log('camera', {offset, speed})
  }

  const keys = require('../../arduino/cmd-keys')
  registerCmd(keys.CMD_KEY_CAMERA, onCamera)
}

module.exports = { setup }
