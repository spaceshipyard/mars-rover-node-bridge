const EventEmitter = require('events');
const five = require("johnny-five");
const _ = require('lodash');

const DEFAULT_CMD_RESULT = 'OK';

const cmdEventEmitter = new EventEmitter();
const registerCmd = (key, handler) => {
    if (cmdEventEmitter.listenerCount(key) > 0) {
        console.warn(`${key} already registered.`);
    }
    cmdEventEmitter.on(key, handler);
}


function configureArduinoChannel(controlModules, serialPort = undefined) {
    let isOpen = false;

    if (_.isEmpty(controlModules)) {
        throw new Error('At least one control module should be defined for arduino command handling', 'NoControlModules')
    }
    let board = new five.Board({ repl: false, port: serialPort });
    board.on("ready", function () {
        isOpen = true;
        cmdEventEmitter.removeAllListeners();
        controlModules.map(m => m.setup({ five, board }, registerCmd));
    });

    function sendCmdToArduino({ cmd, params }) {
        try {
            if (!isOpen) {
                console.warn('attempt to flush state to unprepared arduino connection');
                throw (new Error('attempt to flush state to unprepared arduino connection'));
            }

            if (!cmd) {
                console.error('cmd is not defined to be flushed to the arduino');
                throw (new Error('cmd is not defined to be flushed to the arduino'));
            }

            if (!cmdEventEmitter.listenerCount(cmd)) {
                throw new Error(`Unknown cmd '${cmd}'`, 'UnknownCMD');
            }
            
            cmdEventEmitter.emit(cmd, params);
        } catch (error) {
            throw (error);
        }
    };

    return sendCmdToArduino;
}

module.exports = { configureArduinoChannel };