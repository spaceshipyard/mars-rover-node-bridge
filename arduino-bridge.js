let isOpen = false;
const five = require("johnny-five");
let board;
let statusLed;
let rightMotor;
let leftMotor;

const DEFAULT_CMD_RESULT = 'OK';
const PIN_LEFT_DIR = 7;
const PIN_LEFT_SPEED = 6;

const PIN_RIGHT_DIR = 4;
const PIN_RIGHT_SPEED = 5;

function calcLeftSpeedRation(x) {
    return x > 0 ? 1 + x : x + 1;
}

function calcRightSpeedRatio(x) {
    return x < 0 ? 1 + -x : 1 - x;
}

function onDirectionCmd({ offset, magnitude }) {
    console.log('offset', offset);
    
    const leftSpeedRatio = calcLeftSpeedRation(offset.x);
    const rightSpeedRatio = calcRightSpeedRatio(offset.x);
    const leftSpeed = Math.floor(255 * magnitude * leftSpeedRatio);
    const rightSpeed = Math.floor(255 * magnitude * rightSpeedRatio);

    console.log(leftSpeed, rightSpeed);

    if (offset.y > 0) {
        leftMotor.forward(leftSpeed);
        rightMotor.forward(rightSpeed);
    } else {

        leftMotor.reverse(leftSpeed);
        rightMotor.reverse(rightSpeed);
    }
}

function configureArduinoChannel() {

    board = new five.Board({ repl: false });
    board.on("ready", function() {
        isOpen = true;
        statusLed = new five.Led(13);

        leftMotor = new five.Motor({
            pins: {
              pwm: PIN_LEFT_SPEED,
              dir: PIN_LEFT_DIR
            }
        });
          
        rightMotor = new five.Motor({
            pins: {
              pwm: PIN_RIGHT_SPEED,
              dir: PIN_RIGHT_DIR
            }
        });          
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
                statusLed.off();
                switch (cmd) {
                    case 'direction':
                            onDirectionCmd(params);
                        break;

                    default:
                        throw new Error(`Unknown cmd '${cmd}'`, 'UnknownCMD');
                }

                resolveHandler(DEFAULT_CMD_RESULT);

            } catch (error) {
                statusLed.on();
                rejectHandler(error);
            }

        });
    }

    return sendCmdToArduino;
}

module.exports = { configureArduinoChannel, calcLeftSpeedRation, calcRightSpeedRatio };