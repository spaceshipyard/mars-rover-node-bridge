const { EVENT_DISPATCHER_CMD, EVENT_DISPATCHER_CONNECTED } = require('../events/event-keys')
const EventBus = require('../events/event-bus')
const io = require('socket.io-client')
const bluebird = require('bluebird')

const notifyDisconnect = () => EventBus.emit(EVENT_DISPATCHER_CONNECTED, false)
const notifyConnect = () => EventBus.emit(EVENT_DISPATCHER_CONNECTED, true)

function configureSocket ({ dispatcherUrl, targetRoom }) {
  const socket = io.connect(dispatcherUrl, { rejectUnauthorized: false })

  socket.on('message', bluebird.coroutine(function * (msg) {
    console.log('inMsg', msg)
    try {
      EventBus.emit(EVENT_DISPATCHER_CMD, { cmd: msg.cmd, params: msg.params })
      socket.emit('msg:acknowledge', { msg: msg })
    } catch (error) {
      console.error(error)
      socket.emit('msg:rejected', { msg: msg, error: error })
    }
  }))

  socket.on('error', function (data) {
    console.error('error', data)
  })

  socket.on('connect', function () {
    console.log('connect')
    notifyConnect()
  })

  socket.on('event', function (data) {
    console.log('event: ' + data)
  })

  socket.on('disconnect', function () {
    console.log('disconnect')
    notifyDisconnect()
  })

  socket.on('reconnecting', function () {
    console.log('reconnecting')
    notifyDisconnect()
  })

  socket.on('reconnect_error', function (error) {
    console.log('reconnect_error ' + JSON.stringify(error))
    notifyDisconnect()
  })

  socket.on('reconnect_failed', function () {
    console.log('reconnect_failed')
    notifyDisconnect()
  })

  socket.on('welcome', ({ currRooms }) => {
    console.log('welcome', currRooms)
    socket.emit('join', { roomName: targetRoom })
  })

  socket.on('join', ({ roomName }) => {
    console.log('join', roomName)
  })

  socket.on('memberJoined', ({ clientId }) => {
    console.log('memberJoined', clientId)
  })

  return (cmd, params) => {
    socket.emit('message', { cmd: cmd, params })
  }
}

module.exports = configureSocket
