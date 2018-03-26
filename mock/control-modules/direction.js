function calcLeftSpeedRation (direction, speed) {
  return direction > 0 ? 1 + direction : direction + 1
}

function calcRightSpeedRatio (direction, speed) {
  return direction < 0 ? 1 + -direction : 1 - direction
}

function setup ({ five }, registerCmd) {
  function onDirectionCmd ({ offset }) {
    console.log('offset', offset)

    const leftSpeedRatio = offset.x / 2
    const rightSpeedRatio = offset.y / 2
    const leftSpeed = Math.floor(255 * leftSpeedRatio)
    const rightSpeed = Math.floor(255 * rightSpeedRatio)

    console.log(leftSpeed, rightSpeed)

    if (leftSpeed > 0) {
      console.log('left forward', rightSpeed)
    } else {
      console.log('left backward', leftSpeed)
    }

    if (rightSpeed > 0) {
      console.log('left forward', leftSpeed)
    } else {
      console.log('left backward', rightSpeed)
    }
  }

  const keys = require('../../arduino/cmd-keys')
  registerCmd(keys.CMD_KEY_DIRECTION, onDirectionCmd)
}

module.exports = { setup, calcRightSpeedRatio, calcLeftSpeedRation }
