const eventBus = require('../../events/event-bus')
const { I2C_DATA } = require('../sensor-keys')
const { I2C_DATA_RECIEVED } = require('../../events/event-keys')

function handlChannel (five, channelNumber) {
  five.io.i2cRead(channelNumber, 27, function (ArrayOfBytes) {
    var length = ArrayOfBytes.length
    var message = ''

    for (var i = 0; i < length; i++) {
      var code = ArrayOfBytes[i]
      var char = String.fromCharCode(code)
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
function setup ({ five }, registerCmd) {
  handlChannel(five, 1)
  handlChannel(five, 2)
}

module.exports = { setup }
