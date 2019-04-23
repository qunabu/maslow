const analizeValues = require('./pygmalion2/logic').analizeValues;
const setChange  = require('./pygmalion2/logic').setChange;

const leds  = require('./pygmalion2/hardware_eight').leds;
const getChange = require('./pygmalion2/hardware_eight').getChange;
const INTERVAL = require("./pygmalion2/config.js").INTERVAL;

function loop() {

    leds(analizeValues(setChange(getChange())));

}

setInterval(loop, 200);

//
// Exec=/usr/bin/node /home/pi/maslow/raspberry.js

