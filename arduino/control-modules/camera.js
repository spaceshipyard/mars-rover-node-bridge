const { PIN_CAMERA_SERVO_1, PIN_CAMERA_SERVO_2 } = require('../cmd-pins')
const speed = 500
let previousOffset = {x: 0, y: 0}
function setup ({ five }, registerCmd) {
  const cameraServos = new five.Servos([PIN_CAMERA_SERVO_1, PIN_CAMERA_SERVO_2])

  function onCamera ({ offset }) {
    const newOffset = { ...previousOffset, ...offset }
    cameraServos[0].stop()
    cameraServos[1].stop()
    cameraServos[0].to(newOffset.x, speed)
    cameraServos[1].to(newOffset.y, speed)
    previousOffset = newOffset
  }

  const keys = require('../cmd-keys')
  console.log('camera inited', keys.CMD_KEY_CAMERA)
  registerCmd(keys.CMD_KEY_CAMERA, onCamera)
}

module.exports = { setup }
