'use strict';

const bluebird = require('bluebird');
const host = process.env.host || '127.0.0.1';
const port = process.env.port || '8080';
const serialPort = process.env.serialPort || undefined;
const targetRoom = process.env.room || 'lobby';

const { configureArduinoChannel } = require('./arduino/arduino-bridge');

console.log({ host });

const arduinoControlModules = [
    require('./arduino/control-modules/direction'),
    //require('./arduino/control-modules/stepper-platform'),
    require('./arduino/control-modules/camera'),
    require('./arduino/control-modules/proximity')];
const sendCmdToArduino = configureArduinoChannel(arduinoControlModules, serialPort);

const configureSocket = require('./dispather/socket-client');
const sendMessage = configureSocket({ host, port, targetRoom });

const eventBus = require('./events/event-bus');
const { EVENT_DISPATCHER_CMD, EVENT_SENSOR_DATA } = require('./events/event-keys');

eventBus.on(EVENT_DISPATCHER_CMD, sendCmdToArduino);
eventBus.on(EVENT_SENSOR_DATA, (event) => sendMessage(EVENT_SENSOR_DATA, event));