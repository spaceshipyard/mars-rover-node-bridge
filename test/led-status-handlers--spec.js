/* global describe it beforeEach afterEach */

const assert = require('assert')
const sinon = require('sinon')
const getLedHandlers = require('../status/led/led-status-handlers')

describe('led status handler', () => {
  let ledHandlers
  let fakeLeds
  let fakeLedsFactory
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
    fakeLeds = {
      arduino: sinon.spy(),
      dispatcher: sinon.spy()
    }
    fakeLedsFactory = sinon.spy(() => fakeLeds)
    ledHandlers = getLedHandlers(fakeLedsFactory)
  })

  afterEach(() => {
    clock.restore()
  })

  it('should get leds', () => {
    // then
    assert.ok(fakeLedsFactory.calledOnce)
  })

  it('should turn off leds by default', () => {
    // then
    assert.ok(fakeLeds.arduino.firstCall.calledWith(0))
    assert.ok(fakeLeds.dispatcher.firstCall.calledWith(0))
  })

  it('should turn on leds on connection', () => {
    // when
    ledHandlers.onArduinoConnection(true)
    // then
    assert.ok(fakeLeds.arduino.lastCall.calledWith(1))
  })

  it('should turn on leds on dispatcher connection', () => {
    // when
    ledHandlers.onDispatcherConnection(true)
    // then
    assert.ok(fakeLeds.dispatcher.lastCall.calledWith(1))
  })

  it('should blink on the dispatcher data transfering', () => {
    // given
    // when
    ledHandlers.onDispatcherConnection(true)
    assert.ok(fakeLeds.dispatcher.lastCall.calledWith(1))
    ledHandlers.onDispatcherData()
    assert.ok(fakeLeds.dispatcher.lastCall.calledWith(0))
    clock.tick(100)

    // then
    assert.ok(fakeLeds.dispatcher.lastCall.calledWith(1))
  })
})
