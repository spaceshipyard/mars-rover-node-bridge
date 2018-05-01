const EventEmitter = require('events')

let moduleDisposeHandlers = []
const cmdEventEmitter = new EventEmitter()
const registerCmd = (key, handler) => {
  if (cmdEventEmitter.listenerCount(key) > 0) {
    console.warn(`${key} already registered.`)
  }
  cmdEventEmitter.on(key, handler)
}

function configureMockChannel (controlModules, serialPort = undefined) {
  let isOpen = false

  isOpen = true
  console.log('Mock connected')
  cmdEventEmitter.removeAllListeners()
  // note dispose could be undefined because most of modules does not have allocated resources in the reality
  moduleDisposeHandlers.forEach(dispose => dispose && dispose())
  moduleDisposeHandlers = controlModules.map(m => m.setup({}, registerCmd))

  function sendCmdToMock (event) {
    console.log(`Mock cmd ${JSON.stringify(event)}`)
    const { cmd, params } = event
    try {
      if (!isOpen) {
        console.warn('attempt to flush state to unprepared Mock connection')
        throw (new Error('attempt to flush state to unprepared Mock connection'))
      }

      if (!cmd) {
        console.error(`"${cmd}" cmd is not defined to be flushed to the Mock`)
        throw (new Error(`"${cmd}" is not defined to be flushed to the Mock`))
      }

      if (!cmdEventEmitter.listenerCount(cmd)) {
        throw new Error(`Unknown cmd '${cmd}'`, 'UnknownCMD')
      }

      cmdEventEmitter.emit(cmd, params)
    } catch (error) {
      throw (error)
    }
  };

  return sendCmdToMock
}

module.exports = { configureMockChannel }
