const mcp1 = require('simple-mcp3008')(18,24,23,17,3.3);
const mcp2 = require('simple-mcp3008')(18,24,23,27,3.3);
const mcp3 = require('simple-mcp3008')(18,24,23,25,3.3);

function loop() {

	var i=0;
	for (i=0;i<=7;i++) {
		console.log('mcp1 pin', i+1, mcp1.pins[i].getDecimalValue());
	}
	for (i=0;i<=7;i++) {
		console.log('mcp2 pin', i+1, mcp2.pins[i].getDecimalValue());
	}
	for (i=0;i<=7;i++) {
		console.log('mcp3 pin', i+1, mcp3.pins[i].getDecimalValue());
	}
   

}

setInterval(loop, 200);
