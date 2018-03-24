[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# mars-rover-node-bridge

How to start

1. install firmata([firmatabuilder](http://firmatabuilder.com/)) on your board. it is required to [johnny-five](http://johnny-five.io/platform-support/#arduino-uno) integration.
1. install [nodejs](https://nodejs.org/en/)
1. run `npm i`
1. define env variable `host` (by default `http://localhost:80`) it is an url or your [dispatcher](https://github.com/spaceshipyard/mars-rover-dispatcher)
1. define `serialPort` by default it will try to autodetect arduino
1. run `npm start`