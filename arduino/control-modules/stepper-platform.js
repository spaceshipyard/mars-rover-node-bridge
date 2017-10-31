const {PIN_STEPPER1} = require('../cmd-pins');


function setup({five}, registerCmd) {
  const Stepper = five.Stepper;
  const stepper = new Stepper({
    type: Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: 200,
    pins: {
      motor1: PIN_STEPPER1[0],
      motor2: PIN_STEPPER1[1],
      motor3: PIN_STEPPER1[2],
      motor4: PIN_STEPPER1[3]
    }
  });

  function onPlatform({offset}) {
    const { x } = offset;
    stepper.rpm(Math.abs(x)).direction(x > 0 ? Stepper.DIRECTION.CW : Stepper.DIRECTION.CCW).accel(1600).decel(1600).step(100, function() {
      console.log("done moving", x, x > 0, x > 0 ? Stepper.DIRECTION.CW : Stepper.DIRECTION.CCW);
    });


  }

  const keys = require('../cmd-keys');
  registerCmd(keys.CMD_KEY_STEPPER_PLATFORM, onPlatform);
}

module.exports = {setup};