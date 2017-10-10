let isOpen = false;
const five = require("johnny-five");
let board;
let led;

const DEFAULT_CMD_RESULT = 'OK';

function configureArduinoChannel() {

    board = new five.Board({ repl: false });
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
                led.off();
                switch (cmd) {
                    case 'direction':

                        break;

                    default:
                        throw new Error(`Unknown cmd '${cmd}'`, 'UnknownCMD');
                }

                resolveHandler(DEFAULT_CMD_RESULT);

            } catch (error) {
                led.on();
                rejectHandler(error);
            }

        });
    }

    return sendCmdToArduino;
}

module.exports = { configureArduinoChannel };