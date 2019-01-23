const fetchValues  = require('./js/hardware_eight').fetchValues;

function loop() {
   //fetchValues();
   console.log(fetchValues());

}

setInterval(loop, 500);
