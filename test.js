

const fetchValues  = require('./js/hardware').fetchValues;


function loop() {

   fetchValues();

}

setInterval(loop, 200);

//
// Exec=/usr/bin/node /home/pi/maslow/raspberry.js

