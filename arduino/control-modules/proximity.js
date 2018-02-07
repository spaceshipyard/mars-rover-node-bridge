const { PIN_PROXIMITY_1, PIN_PROXIMITY_2 } = require('../cmd-pins');
const keys = require('../cmd-keys');

let intervalId;
const INTERVAL_DURATION = 300;

function setup({ five }, registerCmd, dispatch) {

  /*fixme workaround because of issue in the message architecture
  it is for removing exception then server send back the message in the room
  */
  registerCmd(keys.INFO_PROXIMITY, () => {}); 

  intervalId && clearInterval(intervalId);

  const Proximity = five.Proximity;

  const sensors = [
    
      {name: "front-left", proximity: new Proximity({
        controller: "HCSR04",
        pin: PIN_PROXIMITY_1
      })},
      {name: "front-right", proximity: new Proximity({
        controller: "HCSR04",
        pin: PIN_PROXIMITY_2
      })}
    
  ];

  sensors.map((item) => {
    const { proximity } = item;
    proximity.on("data", function () {
      item.distance = this.cm;
    });
  });



  intervalId = setInterval(() => {
    const data = sensors.map(({name, distance}) => ({name, distance}));
    dispatch(keys.INFO_PROXIMITY, data);
  }, INTERVAL_DURATION);

}

module.exports = { setup };