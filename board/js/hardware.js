const mcp1 = require('simple-mcp3008')(18,24,23,17,3.3);
const mcp2 = require('simple-mcp3008')(18,24,23,27,3.3);
const mcp3 = require('simple-mcp3008')(18,24,23,25,3.3);
const Gpio = require('onoff').Gpio;

const findDifference = require("./logic.js").findDifference;
const initState = require("./logic.js").initState;

const WIN_PIN = require("./config.js").WIN_PIN;
const PINS_MARGINS = require("./config.js").PINS_MARGINS;
const AVR_BREAK = require("./config.js").AVR_BREAK;
const ERROR_MARGIN = require("./config.js").ERROR_MARGIN;


/** RESZTY KODU NIE RUSZAJCIE */

const IS_DEBUG = process.argv.indexOf('debug') != -1;

const ledPins = [
	[new Gpio(26, 'out'),new Gpio(22, 'out')],
	[new Gpio(21, 'out'),new Gpio(20, 'out')],
	[new Gpio(19, 'out'),new Gpio(16, 'out')],
	[new Gpio(13, 'out'),new Gpio(6, 'out')],
	[new Gpio(5, 'out'),new Gpio(4, 'out')]
];


const winPin = new Gpio(WIN_PIN, 'out')

process.on('SIGINT', () => {
	ledPins.forEach(pins => {
		pins[0].unexport();
		pins[1].unexport();		
	})
	winPin.unexport();
});

let arr = [
/*0*/	[0,0],
/*1*/	[0,0,0],
/*2*/	[0,0,0,0],
/*3*/	[0,0,0,0,0],
/*4*/	[0,0,0,0,0,0]
]


let blocksState = initState.slice();

let avrValues = initState.map((row,y) => {
	return row.map((col,x) => {
		return [];
	});
})

function getChange() {
	
	console.log(fetchValues());

    let newBlockState = convertValuesToArr(fetchValues());

    let change = findDifference(blocksState, newBlockState);

    if (change) {
		
		/** catch fuckup caches 
		 * only possiible are 
		 *  0 -> 1 
		 *  0 -> -1
		 *  1 -> 0 
		 * -1 -> 0
		 */ 
		 
		let test = Math.abs(change.from) + Math.abs(change.to);
		
		if (test === 1) {
			blocksState = newBlockState;        
			console.log(change);
			return change;
		}
       

    }

    return null;

}

/** 
 * i - rzad
 * value -wartosc pina 
 * returns 
 * - 0 - nie ma wlozonego zadnego klocka
 * - 1 - jest wlozony zly klocek 
 * - 2 - jest wlozony dobry klocek 
 */ 
function valueForRow(i, value) {
	
	if (value < ERROR_MARGIN) {
		return 0; 
	} 
	
	return value > PINS_MARGINS[i][0] && value < PINS_MARGINS[i][1] ? 1 : -1;
	
	/*
	
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
	*/ 
		
}

function fetchValues() {
	
	/** TODO push values into array and remove remove tail */
	
	for (var i=0; i<8; i++) {
		 console.log('mcp1 '+i, mcp1.pins[i].getDecimalValue());
	}
	
	for (var i=0; i<8; i++) {
		 console.log('mcp2 '+i, mcp2.pins[i].getDecimalValue());
	}

	
	return;
	
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
    
    console.log('values', values);
     
    
    avrValues[4][5].push( mcp1.pins[0].getDecimalValue() );
    avrValues[4][4].push( mcp1.pins[1].getDecimalValue() );
    avrValues[4][3].push( mcp1.pins[2].getDecimalValue() );
    avrValues[4][2].push( mcp1.pins[3].getDecimalValue() );
    avrValues[4][1].push( mcp1.pins[4].getDecimalValue() );
    avrValues[4][0].push( mcp1.pins[5].getDecimalValue() );
    avrValues[3][4].push( mcp1.pins[6].getDecimalValue() );
    avrValues[3][3].push( mcp1.pins[7].getDecimalValue() );
    avrValues[3][2].push( mcp2.pins[0].getDecimalValue() );
    avrValues[3][1].push( mcp2.pins[1].getDecimalValue() );
    avrValues[3][0].push( mcp2.pins[2].getDecimalValue() );
    avrValues[2][3].push( mcp2.pins[3].getDecimalValue() );
    avrValues[2][2].push( mcp2.pins[4].getDecimalValue() );
    avrValues[2][1].push( mcp2.pins[5].getDecimalValue() );
    avrValues[2][0].push( mcp2.pins[6].getDecimalValue() );
    avrValues[1][2].push( mcp2.pins[7].getDecimalValue() );
    avrValues[1][1].push( mcp3.pins[0].getDecimalValue() );
    avrValues[1][0].push( mcp3.pins[1].getDecimalValue() );
    avrValues[0][1].push( mcp3.pins[2].getDecimalValue() );
    avrValues[0][0].push( mcp3.pins[3].getDecimalValue() );
    
    if (avrValues[4][5].length > AVR_BREAK) {
		avrValues[4][5].shift( );
		avrValues[4][4].shift( );
		avrValues[4][3].shift( );
		avrValues[4][2].shift( );
		avrValues[4][1].shift( );
		avrValues[4][0].shift( );
		avrValues[3][4].shift( );
		avrValues[3][3].shift( );
		avrValues[3][2].shift( );
		avrValues[3][1].shift( );
		avrValues[3][0].shift( );
		avrValues[2][3].shift( );
		avrValues[2][2].shift( );
		avrValues[2][1].shift( );
		avrValues[2][0].shift( );
		avrValues[1][2].shift( );
		avrValues[1][1].shift( );
		avrValues[1][0].shift( );
		avrValues[0][1].shift( );
		avrValues[0][0].shift( );
	}
	
	/** jezeli ostatni jest wlozony na zero to wyzeruj cala historie */

		
	avrValues = avrValues.map((row,y) => {
		return row.map((col,x) => {
			if (col[col.length-1] < ERROR_MARGIN) {
				return col.map(value => 0)
			}
			return col;
		});
	})
	
	
	
	return avrValues.map((row,y) => {
		return row.map((col,x) => {
			/** wylicz srednia, 
			 * ale ignoruj wartosci zerowe !!!
			 * jezeli sa same zero to zwroc zero
			 *  */
			
			let result = col.filter(value => value > ERROR_MARGIN);
			
			if (result.length) {
				
				return result.reduce(function(previousValue, currentValue, index, array) {
				  return parseInt(previousValue) + parseInt(currentValue);
				}) / result.length;	
				
			} else {
				
				return 0;
			}
						
						
		});
	})
    
    /** return avrages */
    
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
	
	if (diody.filter(dioda => dioda == 2).length == diody.length) {
		winPin.writeSync(1);
		console.log('wygrales');
		//if (IS_DEBUG) {  console.log('wygrales'); }
	} else {
		winPin.writeSync(0);
	}
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
