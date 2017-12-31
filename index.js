'use strict';

const bluebird = require('bluebird');
const io = require('socket.io-client');
const host = process.env.host || 'http://127.0.0.1:8080';
const serialPort = process.env.serialPort || undefined;
const targetRoom = process.env.room || 'lobby';
const socket = io.connect(`${host}`, { rejectUnauthorized: false });
const { configureArduinoChannel } = require('./arduino/arduino-bridge');

console.log({host});

const arduinoControlModules = [
    require('./arduino/control-modules/direction'),
    //require('./arduino/control-modules/stepper-platform'),
    require('./arduino/control-modules/camera')];
const sendCmdToArduino = configureArduinoChannel(arduinoControlModules, serialPort);
configureSocket();



function configureSocket() {

    socket.on('message', bluebird.coroutine(function* (msg) {
        console.log('inMsg', msg);
        try {
            const result = yield sendCmdToArduino({ cmd: msg.cmd, params: msg.params });
            socket.emit('msg:acknowledge', { msg: msg, result: result });
        } catch (error) {
            console.error(error);
            socket.emit('msg:rejected', { msg: msg, error: error })
        }

    }));

    socket.on('error', function (data) {
        console.error('error', data);
    });

    socket.on('connect', function () {
        console.log('connect');
    });

    socket.on('event', function (data) {
        console.log('event: ' + data);
    });

    socket.on('disconnect', function () {
        console.log('disconnect');
    });

    socket.on('reconnecting', function () {
        console.log('reconnecting');
    });

    socket.on('reconnect_error', function (error) {
        console.log('reconnect_error ' + JSON.stringify(error));
    });

    socket.on('reconnect_failed', function () {
        console.log('reconnect_failed');
    });

    socket.on('welcome', ({ currRooms }) => {
        console.log("welcome", currRooms);
        socket.emit('join', {roomName: targetRoom});
    });

    socket.on('join', ({ roomName }) => {

        console.log('join', roomName);
    });

    socket.on('memberJoined', ({clientId}) => {
       console.log('memberJoined', clientId);
    });


}



