const {PIN_PROXIMITY_1} = require('../cmd-pins');

function setup({five}, registerCmd, dispatch) {

  const Proximity = five.Proximity;
  const proximity = new Proximity({
    controller: "HCSR04",
    pin: PIN_PROXIMITY_1
  });

  const keys = require('../cmd-keys');
  registerCmd(keys.INFO_PROXIMITY, () => {});

  proximity.on("data", function() {
    dispatch(keys.INFO_PROXIMITY, this.cm);
  });
}

module.exports = {setup};