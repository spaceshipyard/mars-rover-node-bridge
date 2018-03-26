const { SENSOR_DATA_PROXIMITY } = require('../../arduino/sensor-keys')
const { EVENT_SENSOR_DATA } = require('../../events/event-keys')
const eventBus = require('../../events/event-bus')
const _ = require('lodash')

let intervalId
const INTERVAL_DURATION = 300

const defaultMockParams = {
  interval: INTERVAL_DURATION,
  sensorsCount: 2
}

function setup (mockParams, registerCmd) {
  intervalId && clearInterval(intervalId)
  const params = {...defaultMockParams, ...mockParams}
  const sensors = _.range(params.sensorsCount).map(id => ({name: `proximity-${id}`}))

  const updateSensorData = () => {
    const data = sensors.map(({ name }) => ({ name, distance: Math.random() * 300 }))
    eventBus.emit(EVENT_SENSOR_DATA, { type: SENSOR_DATA_PROXIMITY, data })
  }

  intervalId = setInterval(updateSensorData, mockParams.interval || INTERVAL_DURATION)

  return () => {
    intervalId && clearInterval(intervalId)
  }
}

module.exports = { setup }
