'use strict';

const bluebird = require('bluebird');
const io = require('socket.io-client');
const host = process.env.host || '192.168.1.41:8082';
const serialPort = process.env.comPort || 'COM3';
const socket = io.connect(`${host}`, { rejectUnauthorized: false });

let isOpen = false;

const sendCmdToArduino = configureArduinoChannel();
configureSocket();

function configureArduinoChannel() {

    var five = require("johnny-five");
    var board = new five.Board({ repl: false });
    var led;

    board.on("ready", function() {
        isOpen = true;

        led = new five.Led(13);
    });

    function sendCmdToArduino({ cmd, params }) {
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

            try {
                switch (cmd) {
                    case 'direction':
                        led.on();
                        resolveHandler('OK');
                        break;

                    default:
                        throw new Error(`Unknown cmd '${cmd}'`, 'UnknownCMD');
                }
            } catch (error) {
                led.off();
                rejectHandler(error);
            }

        });
    }

    return sendCmdToArduino;
}


function configureSocket() {

    socket.on('message', bluebird.coroutine( function *(msg) {
        console.log('inMsg', msg);
        try {
            const result = yield sendCmdToArduino({ cmd: msg.cmd, params: msg.params });
            socket.emit('msg:acknowledge', { msg: msg, result: result });
        } catch (error) {
            socket.emit('msg:rejected', { msg: msg, error: error })
        }

    }));

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



