const eventBus = require('../../events/event-bus')
const { I2C_DATA } = require('../sensor-keys')
const { I2C_DATA_RECIEVED } = require('../../events/event-keys')

function handleChannel (board, channelNumber) {
  board.io.i2cRead(channelNumber, 27, function (arrayOfBytes) {
    const length = arrayOfBytes.length
    let message = ''

    console.log('arrayOfBytes', arrayOfBytes)

    for (let i = 0; i < length; i++) {
      const code = arrayOfBytes[i]
      const char = String.fromCharCode(code)
      if (code !== 255) {
        message = message.concat(char)
      }
    }
    if (message.length !== 1) {
      console.log('i2c message recieved', channelNumber, message)
      eventBus.emit(I2C_DATA_RECIEVED, { type: I2C_DATA, message })
    }
  })
}
function setup ({ board }, registerCmd) {
  board.io.i2cConfig()
  handleChannel(board, 0x01)
  handleChannel(board, 0x02)
  console.log('i2c reader set up -', I2C_DATA_RECIEVED)
}

module.exports = { setup }
