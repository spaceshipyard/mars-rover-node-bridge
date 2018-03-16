const { EVENT_SENSOR_DATA } = require('../../events/event-keys');

const { PIN_PROXIMITY_1, PIN_PROXIMITY_2 } = require('../cmd-pins');
const { emit } = require('../../events/event-bus');

let intervalId;
const INTERVAL_DURATION = 300;

function setup({ five }, registerCmd, dispatch) {

  intervalId && clearInterval(intervalId);

  const Proximity = five.Proximity;

  const sensors = [

    {
      name: "front-left", proximity: new Proximity({
        controller: "HCSR04",
        pin: PIN_PROXIMITY_1
      })
    },
    {
      name: "front-right", proximity: new Proximity({
        controller: "HCSR04",
        pin: PIN_PROXIMITY_2
      })
    }

  ];

  sensors.map((item) => {
    const { proximity } = item;
    proximity.on("data", function () {
      item.distance = this.cm;
    });
  });



  intervalId = setInterval(() => {
    const data = sensors.map(({ name, distance }) => ({ name, distance }));
    emit(EVENT_SENSOR_DATA, data);
  }, INTERVAL_DURATION);

}

module.exports = { setup };