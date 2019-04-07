const assert = require('assert')
const sinon = require('sinon')
const eventBus = require('../events/event-bus')
const {setup, UPDATE_INTERVAL_DURATION} = require('../arduino/control-modules/motor-encoder-sensors')

const {SENSOR_DATA_MOTOR_ENCODER} = require('../arduino/sensor-keys')
const {PIN_MOTOR_LEFT_ENCODER_SENSOR, PIN_MOTOR_RIGHT_ENCODER_SENSOR} = require('../arduino/cmd-pins')
const {EVENT_SENSOR_DATA} = require('../events/event-keys')

/* global describe it before after */

describe('motor encoder sensors arduino module', function () {
  let dispose
  let motorLeftSensor = {raw: undefined}
  let motorRightSensor = {raw: undefined}
  let eventBusEmitFake
  let clock

  before(() => {
    clock = sinon.useFakeTimers()

    eventBusEmitFake = sinon.fake(eventBus.emit)
    sinon.replace(eventBus, 'emit', eventBusEmitFake)

    dispose = setup({
      five: {
        Sensor: function ({pin}) {
          switch (pin) {
            case PIN_MOTOR_LEFT_ENCODER_SENSOR:
              return motorLeftSensor
            case PIN_MOTOR_RIGHT_ENCODER_SENSOR:
              return motorRightSensor
            default:
              throw new Error(`Unknown sensor pin: ${pin}`)
          }
        }
      }
    })
  })

  after(() => {
    clock.restore()
    sinon.restore()
    dispose && dispose()
  })

  it('should fire events on sensor change', function () {
    // given
    const leftSensorData = 123
    const rightSensorData = 321
    const expectedMessage = {
      type: SENSOR_DATA_MOTOR_ENCODER,
      data: [
        {name: 'left', value: leftSensorData},
        {name: 'right', value: rightSensorData}
      ]
    }
    // when
    motorLeftSensor.raw = leftSensorData
    motorRightSensor.raw = rightSensorData
    clock.tick(UPDATE_INTERVAL_DURATION)

    // then
    assert.equal(eventBusEmitFake.lastCall.args[0], EVENT_SENSOR_DATA)
    assert.deepStrictEqual(eventBusEmitFake.lastCall.lastArg, expectedMessage)
  })
})
