/**
 * 
 * # Software SPI configuration:
CLK  = 18
MISO = 23
MOSI = 24
CS   = 17

mcp1 = Adafruit_MCP3008.MCP3008(clk=CLK, cs=17, miso=MISO, mosi=MOSI)
mcp2 = Adafruit_MCP3008.MCP3008(clk=CLK, cs=27, miso=MISO, mosi=MOSI)
mcp3 = Adafruit_MCP3008.MCP3008(clk=CLK, cs=25, miso=MISO, mosi=MOSI)
 */ 
// (SPICLK, SPIMISO, SPIMOSI, SPICS, Voltage)
var mcp1 = require('simple-mcp3008')(18,24,23,17,3.3);
var mcp2 = require('simple-mcp3008')(18,24,23,27,3.3);
var mcp3 = require('simple-mcp3008')(18,24,23,25,3.3);

const Gpio = require('onoff').Gpio;

const IS_DEBUG = process.argv.indexOf('debug') != -1;

const ledPins = [
	[new Gpio(26, 'out'),new Gpio(22, 'out')],
	[new Gpio(21, 'out'),new Gpio(20, 'out')],
	[new Gpio(19, 'out'),new Gpio(16, 'out')],
	[new Gpio(13, 'out'),new Gpio(6, 'out')],
	[new Gpio(5, 'out'),new Gpio(4, 'out')]
];

process.on('SIGINT', () => {
	ledPins.forEach(pins => {
		pins[0].unexport();
		pins[1].unexport();
	})
});

let arr = [
/*0*/	[0,0],
/*1*/	[0,0,0],
/*2*/	[0,0,0,0],
/*3*/	[0,0,0,0,0],
/*4*/	[0,0,0,0,0,0]
]

/** 
 * i - rzad
 * value -wartosc pina 
 * returns 
 * - 0 - nie ma wlozonego zadnego klocka
 * - 1 - jest wlozony zly klocek 
 * - 2 - jest wlozony dobry klocek 
 */ 
function valueForRow(i, value) {
	
	//referencyjne wartosci 

	//	[ [ 512, 512 ],
	//  [ 433, 432, 432 ],
	//  [ 511, 512, 511, 510 ],
	//  [ 489, 492, 491, 486, 490 ],
	//  [ 504, 505, 503, 503, 505, 503 ] ]

	if (value < 20) {
		return 0; 
	} 
	
	switch (i) {
		case 0:
			return value > 495 && value < 525 ? 1 : -1;
		case 1:
			return value > 405 && value < 455 ? 1 : -1;
		case 2:
			return value > 495 && value < 525 ? 1 : -1;
		case 3:
			return value > 465 && value < 515 ? 1 : -1;
		case 4:
			return value > 495 && value < 525 ? 1 : -1;
	}
		
}

function fetchValues() {
	let values = arr.slice(0);// copy of the original array structure;
	values[4][5] = mcp1.pins[0].getDecimalValue();
    values[4][4] = mcp1.pins[1].getDecimalValue();
    values[4][3] = mcp1.pins[2].getDecimalValue();
    values[4][2] = mcp1.pins[3].getDecimalValue();
    values[4][1] = mcp1.pins[4].getDecimalValue();
    values[4][0] = mcp1.pins[5].getDecimalValue();
    values[3][4] = mcp1.pins[6].getDecimalValue();
    values[3][3] = mcp1.pins[7].getDecimalValue();
    values[3][2] = mcp2.pins[0].getDecimalValue();
    values[3][1] = mcp2.pins[1].getDecimalValue();
    values[3][0] = mcp2.pins[2].getDecimalValue();
    values[2][3] = mcp2.pins[3].getDecimalValue();
    values[2][2] = mcp2.pins[4].getDecimalValue();
    values[2][1] = mcp2.pins[5].getDecimalValue();
    values[2][0] = mcp2.pins[6].getDecimalValue();
    values[1][2] = mcp2.pins[7].getDecimalValue();
    values[1][1] = mcp3.pins[0].getDecimalValue();
    values[1][0] = mcp3.pins[1].getDecimalValue();
    values[0][1] = mcp3.pins[2].getDecimalValue();
    values[0][0] = mcp3.pins[3].getDecimalValue();
    return values;
}

function convertValuesToArr() {
	let results = fetchValues().map((row,y) => row.map((value,x) => valueForRow(y, value)));
	
	if (IS_DEBUG) { console.log('results', results); }
	
	return results;
}

function loop() {
	leds(analizeValues(convertValuesToArr()));
}

function leds(diody) {

	if (IS_DEBUG) {  console.log('leds', diody); }

	diody.forEach((dioda, ii) => {
		let i = (diody.length - 1) - ii;
		switch (dioda) {
			case 2: // zielony 			
				ledPins[i][1].writeSync(0);//wylacz czerwony
				ledPins[i][0].writeSync(1);//wylacz zielony
				break;
			case 1: // czerowyny
				ledPins[i][1].writeSync(1);//wlacz czerwony
				ledPins[i][0].writeSync(0);//wylacz zielony
				break;
			case 3: // w dobrym rzedzie sa
			case 0: // pusty
				ledPins[i][0].writeSync(0);//wylacz czerwony
				ledPins[i][1].writeSync(0);//wylacz zielony
			default:
		}
	})		
}


/** DEBUG */

if (IS_DEBUG) {
	setInterval(() => console.log('values from read', fetchValues()), 100);
}

/** helper functions */
function fetchVoltage() {
	let values = arr.slice(0);// copy of the original array structure;
	values[4][5] = mcp1.pins[0].getVoltage();
    values[4][4] = mcp1.pins[1].getVoltage();
    values[4][3] = mcp1.pins[2].getVoltage();
    values[4][2] = mcp1.pins[3].getVoltage();
    values[4][1] = mcp1.pins[4].getVoltage();
    values[4][0] = mcp1.pins[5].getVoltage();
    values[3][4] = mcp1.pins[6].getVoltage();
    values[3][3] = mcp1.pins[7].getVoltage();
    values[3][2] = mcp2.pins[0].getVoltage();
    values[3][1] = mcp2.pins[1].getVoltage();
    values[3][0] = mcp2.pins[2].getVoltage();
    values[2][3] = mcp2.pins[3].getVoltage();
    values[2][2] = mcp2.pins[4].getVoltage();
    values[2][1] = mcp2.pins[5].getVoltage();
    values[2][0] = mcp2.pins[6].getVoltage();
    values[1][2] = mcp2.pins[7].getVoltage();
    values[1][1] = mcp3.pins[0].getVoltage();
    values[1][0] = mcp3.pins[1].getVoltage();
    values[0][1] = mcp3.pins[2].getVoltage();
    values[0][0] = mcp3.pins[3].getVoltage();
    return values;
}

function init() {
    console.log('init hi');
}

module.exports = {
    init,
    leds,
    valueForRow,
    convertValuesToArr,
    fetchValues,
    getChange
};

/*

export {
    init,
    leds,
    valueForRow,
    convertValuesToArr,
    fetchValues,
    getChange
};

*/