'use strict'

const dispatcherUrl = process.env.dispatcherUrl || 'https://vnabatov-mars-rover-dispatcher-glitch-me.glitch.me/'
const serialPort = process.env.serialPort || undefined
const targetRoom = process.env.room || 'lobby'
const statusHandlers = process.env.statusHandlers || 'console-status-handlers'

console.log({ dispatcherUrl, statusHandlers })

// config status panel
const statusModuleSetup = require('./status/status-module')
const consoleStatusHandlers = require(`./status/${statusHandlers}.js`)
statusModuleSetup(consoleStatusHandlers)

// config arduino
const arduinoControlModules = [
  require('./arduino/control-modules/direction'),
  require('./arduino/control-modules/camera'),
  require('./arduino/control-modules/proximity'),
  require('./arduino/control-modules/i2c-reader')
]
const { configureArduinoChannel } = require('./arduino/arduino-bridge')
const sendCmdToArduino = configureArduinoChannel(arduinoControlModules, serialPort)

// config dispatcher
const configureDispatherSocket = require('./dispather/socket-client')
const sendMsgToDispatcher = configureDispatherSocket({ dispatcherUrl, targetRoom })

// config event-bus
const eventBus = require('./events/event-bus')
const { EVENT_DISPATCHER_CMD, EVENT_SENSOR_DATA, I2C_DATA_RECIEVED } = require('./events/event-keys')

eventBus.on(EVENT_DISPATCHER_CMD, sendCmdToArduino)
eventBus.on(EVENT_SENSOR_DATA, (event) => sendMsgToDispatcher(EVENT_SENSOR_DATA, event))
eventBus.on(I2C_DATA_RECIEVED, (event) => sendMsgToDispatcher(I2C_DATA_RECIEVED, event))
