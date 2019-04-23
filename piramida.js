const analizeValues = require('./piramida/logic').analizeValues;
const setChange  = require('./piramida/logic').setChange;

const leds  = require('./piramida/hardware').leds;
const getChange = require('./piramida/hardware').getChange;
const INTERVAL = require("./piramida/config.js").INTERVAL;

function loop() {

    leds(analizeValues(setChange(getChange())));

}

setInterval(loop, 200);

//
// Exec=/usr/bin/node /home/pi/maslow/raspberry.js

