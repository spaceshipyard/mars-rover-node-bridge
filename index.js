'use strict'

const protocol = process.env.protocol || 'https'
const host = process.env.host || '127.0.0.1'
const port = process.env.port || '8080'
const serialPort = process.env.serialPort || undefined
const targetRoom = process.env.room || 'lobby'
const statusHandlers = process.env.statusHandlers || 'console-status-handlers'

console.log({ host, statusHandlers })

// config status panel
const statusModuleSetup = require('./status/status-module')
const consoleStatusHandlers = require(`./status/${statusHandlers}.js`)
statusModuleSetup(consoleStatusHandlers)

// config arduino
const arduinoControlModules = [
  require('./arduino/control-modules/direction'),
  // require('./arduino/control-modules/stepper-platform'),
  require('./arduino/control-modules/camera'),
  require('./arduino/control-modules/proximity')]
const { configureArduinoChannel } = require('./arduino/arduino-bridge')
const sendCmdToArduino = configureArduinoChannel(arduinoControlModules, serialPort)

// config dispatcher
const configureDispatherSocket = require('./dispather/socket-client')
const sendMsgToDispatcher = configureDispatherSocket({ protocol, host, port, targetRoom })

// config event-bus
const eventBus = require('./events/event-bus')
const { EVENT_DISPATCHER_CMD, EVENT_SENSOR_DATA } = require('./events/event-keys')

eventBus.on(EVENT_DISPATCHER_CMD, sendCmdToArduino)
eventBus.on(EVENT_SENSOR_DATA, (event) => sendMsgToDispatcher(EVENT_SENSOR_DATA, event))
