const five = require("johnny-five");
const _ = require('lodash');

const DEFAULT_CMD_RESULT = 'OK';


const cmdMap = new Map();
const registerCmd = (key, handler) => {
    if (cmdMap.has(key)) {
        throw new Error(`${key} already registered.`);
    }
    cmdMap.set(key, handler);
}


function configureArduinoChannel(controlModules, serialPort = undefined) {
    let isOpen = false;
    
    if (_.isEmpty(controlModules)) {
        throw new Error('At least one control module should be defined for arduino command handling', 'NoControlModules')
    }
    let board = new five.Board({ repl: false, port:serialPort });
    board.on("ready", function () {
        isOpen = true;
        cmdMap.clear();
        controlModules.map(m => m.setup({ five, board }, registerCmd));
    });

    function sendCmdToArduino({ cmd, params }) {
        console.log({ cmd, params });
        return new Promise((resolveHandler, rejectHandler) => {
            try {
                if (!isOpen) {
                    console.warn('attempt to flush state to unprepared arduino connection');
                    throw (new Error('attempt to flush state to unprepared arduino connection'));
                }

                if (!cmd) {
                    console.error('cmd is not defined to be flushed to the arduino');
                    throw (new Error('cmd is not defined to be flushed to the arduino'));
                }

                if (!cmdMap.has(cmd)) {
                    throw new Error(`Unknown cmd '${cmd}'`, 'UnknownCMD');
                }
                const handler = cmdMap.get(cmd);
                const cmdResult = handler(params);

                resolveHandler(cmdResult || DEFAULT_CMD_RESULT); // fixme questionable solution 
            } catch (error) {
                rejectHandler(error);
            }

        });
    }

    return sendCmdToArduino;
}

module.exports = { configureArduinoChannel };