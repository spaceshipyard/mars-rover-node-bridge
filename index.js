'use strict'

const dispatcherUrl = process.env.dispatcherUrl || 'https://localhost'
const serialPort = process.env.serialPort || undefined
const targetRoom = process.env.room || 'lobby'
const statusHandlers = process.env.statusHandlers || 'console-status-handlers'

console.log({dispatcherUrl, statusHandlers})

// config status panel
const statusModuleSetup = require('./status/status-module')
const consoleStatusHandlers = require(`./status/${statusHandlers}.js`)
const androidBrdige = require('./android/android-bridge')

statusModuleSetup(consoleStatusHandlers)

// config arduino
const arduinoControlModules = [
  require('./arduino/control-modules/direction'),
  // require('./arduino/control-modules/stepper-platform'),
  require('./arduino/control-modules/camera'),
  require('./arduino/control-modules/proximity')]
const {configureArduinoChannel} = require('./arduino/arduino-bridge')
const sendCmdToArduino = configureArduinoChannel(arduinoControlModules, serialPort)

// config dispatcher
const configureDispatherSocket = require('./dispather/socket-client')
const sendMsgToDispatcher = configureDispatherSocket({dispatcherUrl, targetRoom})

// config event-bus
const eventBus = require('./events/event-bus')
const {EVENT_DISPATCHER_CMD, EVENT_SENSOR_DATA} = require('./events/event-keys')

eventBus.on(EVENT_DISPATCHER_CMD, sendCmdToArduino)
eventBus.on(EVENT_SENSOR_DATA, (event) => sendMsgToDispatcher(EVENT_SENSOR_DATA, event))
eventBus.on(EVENT_DISPATCHER_CMD, (event) => event.cmd === 'makeCall' && androidBrdige(event))
