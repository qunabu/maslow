const analizeValues = require('./pygmalion1/logic').analizeValues;
const setChange  = require('./pygmalion1/logic').setChange;

const leds  = require('./pygmalion1/hardware_eight').leds;
const getChange = require('./pygmalion1/hardware_eight').getChange;
const INTERVAL = require("./pygmalion1/config.js").INTERVAL;

function loop() {

    leds(analizeValues(setChange(getChange())));

}

setInterval(loop, 200);

//
// Exec=/usr/bin/node /home/pi/maslow/raspberry.js

