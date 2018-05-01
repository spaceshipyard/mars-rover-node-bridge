const EventEmitter = require('events')
const five = require('johnny-five')
const _ = require('lodash')
const eventBus = require('../events/event-bus')
const { EVENT_ARDUINO_CONNECTED } = require('../events/event-keys')

let moduleDisposeHandlers = []
const cmdEventEmitter = new EventEmitter()
const registerCmd = (key, handler) => {
  console.log('registerCmd', key)
  if (cmdEventEmitter.listenerCount(key) > 0) {
    console.warn(`${key} already registered.`)
  }
  cmdEventEmitter.on(key, handler)
}

function configureArduinoChannel (controlModules, serialPort = undefined) {
  let isOpen = false

  if (_.isEmpty(controlModules)) {
    throw new Error('At least one control module should be defined for arduino command handling', 'NoControlModules')
  }
  let board = new five.Board({ repl: false, port: serialPort })
  board.on('ready', function () {
    isOpen = true
    console.log('arduino connected')
    eventBus.emit(EVENT_ARDUINO_CONNECTED, true)
    cmdEventEmitter.removeAllListeners()
    // note dispose could be undefined because most of modules does not have allocated resources in the reality
    moduleDisposeHandlers.forEach(dispose => dispose && dispose())
    moduleDisposeHandlers = controlModules.map(m => m.setup({ five, board }, registerCmd))
  })

  board.on('error', function (event) {
    eventBus.emit(EVENT_ARDUINO_CONNECTED, false)
    console.log(`%s sent a 'error' message: %s`, event.class, event.message)
  })

  function sendCmdToArduino (event) {
    console.log(`arduino cmd ${JSON.stringify(event)}`)
    const { cmd, params } = event
    try {
      if (!isOpen) {
        console.warn('attempt to flush state to unprepared arduino connection')
        throw (new Error('attempt to flush state to unprepared arduino connection'))
      }

      if (!cmd) {
        console.error(`"${cmd}" cmd is not defined to be flushed to the arduino`)
        throw (new Error(`"${cmd}" is not defined to be flushed to the arduino`))
      }

      if (!cmdEventEmitter.listenerCount(cmd)) {
        throw new Error(`Unknown cmd '${cmd}'`, 'UnknownCMD')
      }

      cmdEventEmitter.emit(cmd, params)
    } catch (error) {
      throw (error)
    }
  };

  return sendCmdToArduino
}

module.exports = { configureArduinoChannel }
