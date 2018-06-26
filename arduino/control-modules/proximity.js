const {SENSOR_DATA_PROXIMITY} = require('../sensor-keys')
const {EVENT_SENSOR_DATA} = require('../../events/event-keys')
const {PIN_PROXIMITY_1, PIN_PROXIMITY_2, PIN_PROXIMITY_3, PIN_PROXIMITY_4} = require('../cmd-pins')
const eventBus = require('../../events/event-bus')

let intervalId
const INTERVAL_DURATION = 300

function setup ({five}, registerCmd) {
  if (process.env.disableProximity === 'true') {
    console.warn('proximity sensors are disabled')
    return
  }

  intervalId && clearInterval(intervalId)

  const Proximity = five.Proximity

  const sensors = [

    {
      name: 'front-left',
      proximity: new Proximity({
        controller: 'HCSR04',
        pin: PIN_PROXIMITY_1
      })
    },
    {
      name: 'front-right',
      proximity: new Proximity({
        controller: 'HCSR04',
        pin: PIN_PROXIMITY_2
      })
    },
    {
      name: 'back-left',
      proximity: new Proximity({
        controller: 'HCSR04',
        pin: PIN_PROXIMITY_3
      })
    },
    {
      name: 'back-right',
      proximity: new Proximity({
        controller: 'HCSR04',
        pin: PIN_PROXIMITY_4
      })
    }

  ]

  sensors.map((item) => {
    const {proximity} = item
    proximity.on('data', function () {
      item.distance = this.cm
    })
  })

  const updateSensorData = () => {
    const data = sensors.map(({name, distance}) => ({name, distance}))
    eventBus.emit(EVENT_SENSOR_DATA, {type: SENSOR_DATA_PROXIMITY, data})
  }

  intervalId = setInterval(updateSensorData, INTERVAL_DURATION)

  updateSensorData()

  return () => {
    intervalId && clearInterval(intervalId)
  }
}

module.exports = {setup}
