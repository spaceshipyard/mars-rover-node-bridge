const { PIN_CAMERA_SERVO_1, PIN_CAMERA_SERVO_2 } = require('../cmd-pins')
const speed = 500

function setup ({ five }, registerCmd) {
  const cameraServos = new five.Servos([PIN_CAMERA_SERVO_1, PIN_CAMERA_SERVO_2])

  function onCamera ({ offset }) {
    cameraServos[0].stop()
    cameraServos[1].stop()
    cameraServos[0].to(offset.x, speed)
    cameraServos[1].to(offset.y, speed)
  }

  const keys = require('../cmd-keys')
  registerCmd(keys.CMD_KEY_CAMERA, onCamera)
}

module.exports = { setup }
