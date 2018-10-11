//const analizeValues = require('./js/logic').analizeValues;
//const setChange  = require('./js/logic').setChange;

//const leds  = require('./js/hardware').leds;
const getChange = require('./js/hardware').getChange;
const INTERVAL = require("./js/config.js").INTERVAL;

function loop() {

	console.log(getChange());
    //leds(analizeValues(setChange(getChange())));

}

setInterval(loop, 200);

//
// Exec=/usr/bin/node /home/pi/maslow/raspberry.js

