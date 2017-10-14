const { PIN_CAMERA_SERVO_1, PIN_CAMERA_SERVO_2 } = require('../cmd-pins');


function setup({ five }, registerCmd) {
    const cameraServos = new five.Servos([PIN_CAMERA_SERVO_1, PIN_CAMERA_SERVO_2]);

    function onCamera({ offset }) {
        cameraServos[0].to(90 + 90 * offset.x);
        cameraServos[1].to(90 + 90 * offset.y);
    }

    const keys = require('../cmd-keys');
    registerCmd(keys.CMD_KEY_CAMERA, onCamera);
}

module.exports = { setup };