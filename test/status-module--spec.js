const assert = require('assert')
const sinon = require('sinon')
const statusSetup = require('../status/status-module')
const eventBus = require('../events/event-bus')
const { EVENT_ARDUINO_CONNECTED, EVENT_DISPATCHER_CONNECTED, EVENT_DISPATCHER_CMD, EVENT_SENSOR_DATA } = require('../events/event-keys')

/* global describe it beforeEach */

describe('status module', function () {
  let status
  let onArduinoConnection = sinon.spy()
  let onDispatcherConnection = sinon.spy()
  let onArduinoData = sinon.spy()
  let onDispatcherData = sinon.spy()

  beforeEach(() => {
    status = statusSetup(() => ({
      onArduinoConnection,
      onDispatcherConnection,
      onDispatcherData,
      onArduinoData
    }))
  })

  it('should initialize object', () => {
    assert.ok(status)
    assert.ok(onArduinoConnection.calledWith(false))
    assert.ok(onDispatcherConnection.calledWith(false))
  })

  it('should change arduino connection status', () => {
    // given
    // when
    eventBus.emit(EVENT_ARDUINO_CONNECTED, true)
    // then
    assert.ok(onArduinoConnection.calledWith(true))
  })

  it('should change dispatcher connection status', () => {
    // when
    eventBus.emit(EVENT_DISPATCHER_CONNECTED, true)
    // then
    assert.ok(onDispatcherConnection.calledWith(true))
  })

  it('should handle dispatcher data transfer', () => {
    // when
    eventBus.emit(EVENT_DISPATCHER_CMD)
    // then
    assert.ok(onDispatcherData.called)
  })

  it('should handle arduino data transfer', () => {
    // when
    eventBus.emit(EVENT_SENSOR_DATA)
    // then
    assert.ok(onArduinoData.called)
  })
})
