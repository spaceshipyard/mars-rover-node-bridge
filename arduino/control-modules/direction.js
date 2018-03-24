const { PIN_LEFT_DIR, PIN_LEFT_SPEED, PIN_RIGHT_DIR, PIN_RIGHT_SPEED } = require('../cmd-pins')

function calcLeftSpeedRation (direction, speed) {
  return direction > 0 ? 1 + direction : direction + 1
}

function calcRightSpeedRatio (direction, speed) {
  return direction < 0 ? 1 + -direction : 1 - direction
}

function setup ({ five }, registerCmd) {
  const leftMotor = new five.Motor({
    pins: {
      pwm: PIN_LEFT_SPEED,
      dir: PIN_LEFT_DIR
    }
  })

  const rightMotor = new five.Motor({
    pins: {
      pwm: PIN_RIGHT_SPEED,
      dir: PIN_RIGHT_DIR
    }
  })

  function onDirectionCmd ({ offset }) {
    console.log('offset', offset)

    const leftSpeedRatio = offset.x / 2// calcLeftSpeedRation(offset.x, offset.y);
    const rightSpeedRatio = offset.y / 2// calcRightSpeedRatio(offset.x, offset.y);
    const leftSpeed = Math.floor(255 * leftSpeedRatio)
    const rightSpeed = Math.floor(255 * rightSpeedRatio)

    console.log(leftSpeed, rightSpeed)

    if (leftSpeed > 0) {
      leftMotor.forward(leftSpeed)
    } else {
      leftMotor.reverse(Math.abs(leftSpeed))
    }

    if (rightSpeed > 0) {
      rightMotor.forward(rightSpeed)
    } else {
      rightMotor.reverse(Math.abs(rightSpeed))
    }
  }

  const keys = require('../cmd-keys')
  registerCmd(keys.CMD_KEY_DIRECTION, onDirectionCmd)
}

module.exports = { setup, calcRightSpeedRatio, calcLeftSpeedRation }
