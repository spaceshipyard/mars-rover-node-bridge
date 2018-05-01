const Gpio = require('onoff').Gpio
const LED_ARDUINO = new Gpio(3, 'out')
const LED_DISPATCHER = new Gpio(4, 'out')

module.exports = () => ({
  arduino: (value) => LED_ARDUINO.write(+value, () => {}),
  dispatcher: (value) => LED_DISPATCHER.write(+value, () => {})
})
