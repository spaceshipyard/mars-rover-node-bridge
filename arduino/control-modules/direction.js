const { PIN_LEFT_DIR, PIN_LEFT_SPEED, PIN_RIGHT_DIR, PIN_RIGHT_SPEED } = require('../cmd-pins');


function calcLeftSpeedRation(x) {
    return x > 0 ? 1 + x : x + 1;
}

function calcRightSpeedRatio(x) {
    return x < 0 ? 1 + -x : 1 - x;
}

function setup({ five }, registerCmd) {

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

    function onDirectionCmd({ offset }) {
        console.log('offset', offset);

        const magnitude = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
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

    const keys = require('../cmd-keys');
    registerCmd(keys.CMD_KEY_DIRECTION, onDirectionCmd);
}

module.exports = { setup, calcRightSpeedRatio, calcLeftSpeedRation };