const eventBus = require('../events/event-bus')
const { EVENT_ARDUINO_CONNECTED, EVENT_DISPATCHER_CONNECTED, EVENT_DISPATCHER_CMD, EVENT_SENSOR_DATA } = require('../events/event-keys')

const setup = (getHandler) => {
  const { onArduinoConnection, onDispatcherConnection, onDispatcherData, onArduinoData } = getHandler()
  onArduinoConnection(false)
  onDispatcherConnection(false)

  eventBus.on(EVENT_ARDUINO_CONNECTED, onArduinoConnection)
  eventBus.on(EVENT_DISPATCHER_CONNECTED, onDispatcherConnection)
  eventBus.on(EVENT_DISPATCHER_CMD, onDispatcherData)
  eventBus.on(EVENT_SENSOR_DATA, onArduinoData)

  return true
}

module.exports = setup
