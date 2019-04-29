const mcp1 = require('simple-mcp3008')(18,24,23,17,3.3);
const mcp2 = require('simple-mcp3008')(18,24,23,27,3.3);
const mcp3 = require('simple-mcp3008')(18,24,23,25,3.3);

function loop() {
	var i;
	for (i=0;i<=7;i++) { console.log('mcp1', i+1, mcp1.pins[i].getDecimalValue(), mcp1.pins[i].getVoltage() ); }
	for (i=0;i<=7;i++) { console.log('mcp2', i+1, mcp2.pins[i].getDecimalValue(), mcp2.pins[i].getVoltage() ); }
	for (i=0;i<=7;i++) { console.log('mcp3', i+1, mcp3.pins[i].getDecimalValue(), mcp3.pins[i].getVoltage() ); }
}
setInterval(loop, 500);
