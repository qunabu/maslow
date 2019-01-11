const analizeValues = require('./js/logic').analizeValues;
const setChange  = require('./js/logic').setChange;

const leds  = require('./js/hardware_eight').leds;
const getChange = require('./js/hardware_eight').getChange;
const INTERVAL = require("./js/config.js").INTERVAL;

function loop() {

    leds(analizeValues(setChange(getChange())));

}

setInterval(loop, 200);

//
// Exec=/usr/bin/node /home/pi/maslow/raspberry.js

