class LedBlinker { // todo remove bicycle
  constructor (led, value = 0) {
    this.led = led
    this.state(value)
  }

  isBlinking () {
    return !!this.timeoutId
  }

  blink () {
    if (this.isBlinking()) {
      this.stopBlinking()
    }

    this.led(+!this.state)
    this.timeoutId = setTimeout(() => {
      this.stopBlinking()
    }, 100)
  }

  stopBlinking () {
    this.state(this.value)
    this.timeoutId && clearInterval(this.timeoutId)
    this.timeoutId = undefined
  }

  state (value) {
    this.value = value
    this.led(+value)
  }
}

module.exports = (ledFactory = require('./led-factoty')) => {
  const leds = ledFactory()
  const arduinoLed = new LedBlinker(leds.arduino)
  const dispatcherLed = new LedBlinker(leds.dispatcher)

  return {
    onArduinoConnection: (connected) => {
      arduinoLed.state(connected)
    },
    onDispatcherConnection: (connected) => {
      dispatcherLed.state(connected)
    },
    onDispatcherData: () => {
      dispatcherLed.blink()
    },
    onArduinoData: () => {
      arduinoLed.blink()
    }
  }
}
