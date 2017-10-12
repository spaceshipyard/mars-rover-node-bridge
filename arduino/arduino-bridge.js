let isOpen = false;
const five = require("johnny-five");
let board;
let statusLed;
let context;

const DEFAULT_CMD_RESULT = 'OK';
const PIN_LEFT_DIR = 7;
const PIN_LEFT_SPEED = 6;

const PIN_RIGHT_DIR = 4;
const PIN_RIGHT_SPEED = 5;

const PIN_CAMERA_SERVO_1 = 9;
const PIN_CAMERA_SERVO_2 = 10;

const { onDirectionCmd } = require('./cmd/direction');


function configureArduinoChannel() {

    board = new five.Board({ repl: false });
    board.on("ready", function() {
        isOpen = true;
        statusLed = new five.Led(13);

        const leftMotor = new five.Motor({
            pins: {
              pwm: PIN_LEFT_SPEED,
              dir: PIN_LEFT_DIR
            }
        });
          
        const rightMotor = new five.Motor({
            pins: {
              pwm: PIN_RIGHT_SPEED,
              dir: PIN_RIGHT_DIR
            }
        });

        const cameraServos = new five.Servos([PIN_CAMERA_SERVO_1, PIN_CAMERA_SERVO_2]);
        
        context = { hardware:{ leftMotor, rightMotor, cameraServos } };
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
                            onDirectionCmd(context, params);
                        break;
                    case 'camera':
                            require('./cmd/camera')(context, params);
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

module.exports = { configureArduinoChannel };