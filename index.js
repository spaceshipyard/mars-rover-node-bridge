'use strict';

const bluebird = require('bluebird');
const io = require('socket.io-client');
const SerialPort = require('serialport');

const host = process.env.host || '192.168.1.41:8082';
const serialPort = process.env.comPort || 'COM3';
const socket = io.connect(`${host}`, { rejectUnauthorized: false });

let arduinoPort;
let isOpen = false;

const promiseListPorts = bluebird.promisify(SerialPort.list);

promiseListPorts().then((ports) => {
    console.log('list of available ports:');
    ports.forEach(function(port) {
        console.log(port.comName);
        console.log(port.pnpId);
        console.log(port.manufacturer);
    });
    console.log('---');
}).catch((err) => {
    console.error(err);
});

configureArduinoChannel();
configureSocket();

function sendCmdToArduino(cmd) {
    return new Promise((resolveHandler, rejectHandler) => {
        if (!isOpen) {
            console.warn('attempt to flush state to unprepared arduino connection');
            rejectHandler(new Error('attempt to flush state to unprepared arduino connection'));
            return
        }

        if (!cmd) {
            console.warn('cmd is not defined to be flushed to the arduino');
            rejectHandler(new Error('cmd is not defined to be flushed to the arduino'));
            return
        }

        console.log('send msg: ' , cmd);
        const message = JSON.stringify(cmd) + "\n";
        arduinoPort.write(message, function(err) {
            if (err) {
                console.log('Error on write: ', err.message);
                rejectHandler(err);
            } else {
                console.log('message written', message);
                //wait the result
                resolveHandler();
            }

        });
    });
}

function configureSocket() {

    socket.on('message', (msg) => {
        console.log('inMsg', msg);
        sendCmdToArduino({ cmd: msg.cmd, params: msg.params });
    });

    socket.on('error', function (data) {
        console.error('error', data);
    });

    socket.on('connect', function(){
        console.log('connect');
    });

    socket.on('event', function(data){
        console.log('event: ' + data);
    });

    socket.on('disconnect', function(){
        console.log('disconnect');
    });

    socket.on('reconnecting', function(){
        console.log('reconnecting');
    });

    socket.on('reconnect_error', function(error){
        console.log('reconnect_error ' + JSON.stringify(error));
    });

    socket.on('reconnect_failed', function(){
        console.log('reconnect_failed');
    });

    socket.on('welcome', ({currRooms}) => {
        console.log("welcome", currRooms);
    });

    socket.on('join', ({roomName}) => {
        console.log('join', roomName);
    });


}



function configureArduinoChannel() {
    arduinoPort = new SerialPort(serialPort, {
        parser: SerialPort.parsers.readline('\n'),
        baudRate: 9600 // this is synced to what was set for the Arduino Code
    });

    arduinoPort.on('open', function() {
        console.log('port is open');
        isOpen = true;
    });

    arduinoPort.on('error', function(err) {
        console.log('Error: ', err.message);
    });

    arduinoPort.on('data', function (data) {
        console.log('Data: ' + data);
    });
}