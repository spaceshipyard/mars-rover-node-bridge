const eventBus = require('../../events/event-bus')
const { SENSOR_DATA_MOTOR_ENCODER } = require('../sensor-keys')
const { PIN_MOTOR_LEFT_ENCODER_SENSOR, PIN_MOTOR_RIGHT_ENCODER_SENSOR } = require('../cmd-pins')
const { EVENT_SENSOR_DATA } = require('../../events/event-keys')
const UPDATE_INTERVAL_DURATION = 250

function dispatchSensorData (data) {
  eventBus.emit(EVENT_SENSOR_DATA, { type: SENSOR_DATA_MOTOR_ENCODER, data })
}

function setup ({ five }, registerCmd) {
  const leftMotorSensor = new five.Sensor({ pin: PIN_MOTOR_LEFT_ENCODER_SENSOR })
  const rightMotorSensor = new five.Sensor({ pin: PIN_MOTOR_RIGHT_ENCODER_SENSOR })

  function updateSensorData () {
    dispatchSensorData([
      { name: 'left', value: leftMotorSensor.raw },
      { name: 'right', value: rightMotorSensor.raw }
    ])
  }

  const sensorUpdateIntervalId = setInterval(() => {
    updateSensorData()
  }, UPDATE_INTERVAL_DURATION)

  updateSensorData()

  return () => {
    clearInterval(sensorUpdateIntervalId)
  }
}

module.exports = { setup, UPDATE_INTERVAL_DURATION }
