const { PIN_LEFT_DIR, PIN_LEFT_SPEED, PIN_RIGHT_DIR, PIN_RIGHT_SPEED } = require('../cmd-pins')
const { EVENT_SENSOR_DATA, EVENT_DISPATCHER_CONNECTED } = require('../../events/event-keys')
const eventBus = require('../../events/event-bus')

const MIN_DISTANCE_FOR_COLLISION = 15

function mapSpeedWithCollisions (proximitySensorsMap, { leftSpeed, rightSpeed }) {
  const frontLeftDistance = proximitySensorsMap.get('front-left')
  const backLeftDistance = proximitySensorsMap.get('back-left')
  const frontRightDistance = proximitySensorsMap.get('front-right')
  const backRightDistance = proximitySensorsMap.get('back-right')

  const min = MIN_DISTANCE_FOR_COLLISION
  const leftSideCollision = leftSpeed > 0 ? frontLeftDistance < min : backLeftDistance < min
  const rightSideCollision = rightSpeed > 0 ? frontRightDistance < min : backRightDistance < min
  const hasCollisions = leftSideCollision || rightSideCollision

  if (hasCollisions) {
    leftSpeed = 0
    rightSpeed = 0
    console.warn(`possible collision is detected left:${leftSideCollision}, right:${rightSideCollision}`)
  }

  return { leftSpeed, rightSpeed }
}

function mapLogicalSpeedPhysical ({ leftSpeed: logicalLeft, rightSpeed: logicalRight }) {
  const leftSpeedRatio = logicalLeft / 2
  const rightSpeedRatio = logicalRight / 2
  const physicalLeftSpeed = Math.floor(255 * leftSpeedRatio)
  const physicalRightSpeed = Math.floor(255 * rightSpeedRatio)

  return { leftSpeed: physicalLeftSpeed, rightSpeed: physicalRightSpeed }
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

  let proximitySensorsMap = new Map()
  let currentSpeed = { leftSpeed: 0, rightSpeed: 0 }

  flushMotorMoving(currentSpeed)

  function onSensorData (event) {
    if (event.type === 'proximity-data') {
      proximitySensorsMap.clear()
      event.data.forEach(({ name, distance }) => {
        proximitySensorsMap.set(name, distance)
      })
    }

    flushMotorMoving(mapSpeedWithCollisions(proximitySensorsMap, currentSpeed))
  }

  function flushMotorMoving (speed) {
    const { leftSpeed, rightSpeed } = speed

    if (leftSpeed > 0) {
      leftMotor.forward(leftSpeed)
    } else if (leftSpeed < 0) {
      leftMotor.reverse(Math.abs(leftSpeed))
    } else {
      leftMotor.stop()
    }

    if (rightSpeed > 0) {
      rightMotor.forward(rightSpeed)
    } else if (rightSpeed < 0) {
      rightMotor.reverse(Math.abs(rightSpeed))
    } else {
      rightMotor.stop()
    }

    currentSpeed = speed
  }

  function onDispatcherConnection (connected) {
    if (!connected) {
      console.warn('dispatcher disconnected, stop moving')
      flushMotorMoving(0)
    }
  }

  function onDirectionCmd ({ offset: { x: leftSpeed, y: rightSpeed } }) {
    console.log('offset', leftSpeed, rightSpeed)

    const physicalSpeed = mapLogicalSpeedPhysical({ leftSpeed, rightSpeed })

    flushMotorMoving(
      mapSpeedWithCollisions(
        proximitySensorsMap,
        physicalSpeed
      )
    )
  }

  const keys = require('../cmd-keys')
  registerCmd(keys.CMD_KEY_DIRECTION, onDirectionCmd)
  eventBus.on(EVENT_SENSOR_DATA, onSensorData)
  eventBus.on(EVENT_DISPATCHER_CONNECTED, onDispatcherConnection)

  return () => {
    eventBus.off(EVENT_SENSOR_DATA, onSensorData)
    eventBus.off(EVENT_DISPATCHER_CONNECTED, onDispatcherConnection)
  }
}

module.exports = { setup }
