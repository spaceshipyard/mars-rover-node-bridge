'use strict';

const bluebird = require('bluebird');
const io = require('socket.io-client');
const host = process.env.host || '127.0.0.1';
const port = process.env.port || '8080';
const serialPort = process.env.serialPort || undefined;
const targetRoom = process.env.room || 'lobby';
const socket = io.connect(`http://${host}:${port}`, { rejectUnauthorized: false });
const { configureArduinoChannel } = require('./arduino/arduino-bridge');

console.log({ host });

function dispatch(cmd, result = '') {
    socket.emit('message', { msg: cmd, cmd, result });
}

const arduinoControlModules = [
    require('./arduino/control-modules/direction'),
    //require('./arduino/control-modules/stepper-platform'),
    require('./arduino/control-modules/camera'),
    require('./arduino/control-modules/proximity')];
const sendCmdToArduino = configureArduinoChannel(arduinoControlModules, serialPort, dispatch);

const configureSocket = require('./dispather/socket-client');
configureSocket();

const eventBus = require('./events/event-bus');
const { EVENT_DISPATCHER_CMD } = require('./events/event-keys');

eventBus.on(EVENT_DISPATCHER_CMD, sendCmdToArduino);
eventBus.on(EVENT_SENSOR_DATA, (cmd, result) => dispatch(cmd, result));