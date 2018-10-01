

const    analizeValues = require('./js/logic').analizeValues;
const    setChange  = require('./js/logic').setChange;

const leds  = require('./js/hardware').leds;
const init = require('./js/hardware').init;
const getChange = require('./js/hardware').getChange;

/*
    import {
   
} from "./js/web.js";

*/

function loop() {


    leds(analizeValues(setChange(getChange())));

}


//init();

//loop();


setInterval(loop, 200);