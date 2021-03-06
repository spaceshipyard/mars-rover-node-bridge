const eventBus = require('../../events/event-bus')
const { I2C_DATA } = require('../sensor-keys')
const { I2C_DATA_RECIEVED } = require('../../events/event-keys')

const READ_DELAY = 1000

function handleChannel (board, channelNumber) {
  return setInterval(function () {
    board.io.i2cReadOnce(channelNumber, 27, function (arrayOfBytes) {
      let message = ''
      let rawMessage = arrayOfBytes.filter(el => el !== 255)

      if (rawMessage.length) {
        rawMessage.forEach(code => {
          const char = String.fromCharCode(code)
          if (code !== 255) {
            message = message.concat(char)
          }
        })
      }

      if (message.length > 0) {
        console.log(`i2c message recieved channel=${channelNumber} raw=${rawMessage.join(',')} string="${message}"`)
        eventBus.emit(I2C_DATA_RECIEVED, { type: I2C_DATA, message, rawMessage, channelNumber })
      }
    })
  }, READ_DELAY)
}
function setup ({ board }, registerCmd) {
  board.io.i2cConfig()
  handleChannel(board, 0x01)
  handleChannel(board, 0x02)
  console.log('i2c reader set up -', I2C_DATA_RECIEVED)
}

module.exports = { setup }
