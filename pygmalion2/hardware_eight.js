const mcp1 = require('simple-mcp3008')(18,24,23,17,3.3);
const Gpio = require('onoff').Gpio;

const findDifference = require("./logic.js").findDifference;
const initState = require("./logic.js").initState;

const WIN_PIN = require("./config.js").WIN_PIN;
const PINS_MARGINS = [500,530];
const AVR_BREAK = require("./config.js").AVR_BREAK;
const ERROR_MARGIN = require("./config.js").ERROR_MARGIN;

const exec = require('child_process').exec;
let isWon = undefined;

/** RESZTY KODU NIE RUSZAJCIE */

const IS_DEBUG = process.argv.indexOf('debug') != -1;

const ledPins = [

  [new Gpio(20, 'out'),new Gpio(21, 'out')],
  [new Gpio(26, 'out'),new Gpio(12, 'out')],
  [new Gpio(19, 'out'),new Gpio(6, 'out')],
  [new Gpio(13, 'out'),new Gpio(16, 'out')],	
	
];

ledPins.reverse();


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
/*1*/	[0,0],
/*2*/	[0,0],
/*3*/	[0,0],
]


let blocksState = initState.slice();

let avrValues = initState.map((row,y) => {
	return row.map((col,x) => {
		return [];
	});
})

function getChange() {

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
			
			change.state = newBlockState;
			
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
	
	return value > PINS_MARGINS[0] && value < PINS_MARGINS[1] ? 1 : -1;
    		
}

function fetchValues() {
    
    /*
    return [mcp1].map(mcp => {
	return [0,1,2,3,4,5,6,7].map(i => {
	    return mcp.pins[i].getDecimalValue();
	})
    })
    */ 
        

	
	/** TODO push values into array and remove remove tail */
	
	/*
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
    */ 
    

    avrValues[3][1].push( mcp1.pins[0].getDecimalValue() );
    avrValues[3][0].push( mcp1.pins[1].getDecimalValue() );

    avrValues[2][1].push( mcp1.pins[2].getDecimalValue() );
    avrValues[2][0].push( mcp1.pins[3].getDecimalValue() );
    
    avrValues[1][1].push( mcp1.pins[4].getDecimalValue() );
    avrValues[1][0].push( mcp1.pins[5].getDecimalValue() );
    
    avrValues[0][1].push( mcp1.pins[6].getDecimalValue() );
    avrValues[0][0].push( mcp1.pins[7].getDecimalValue() );
    
    if (avrValues[0][0].length > AVR_BREAK) {

		avrValues[3][1].shift( );
		avrValues[3][0].shift( );

		avrValues[2][1].shift( );
		avrValues[2][0].shift( );

		avrValues[1][1].shift( );
		avrValues[1][0].shift( );
		
		avrValues[0][1].shift( );
		avrValues[0][0].shift( );
	}
	
	/** jezeli ostatni jest wlozony na zero to wyzeruj cala historie */


	
	avrValues = avrValues.map((col,y) => {
		

		return col.map((row, x) => {
			if (row[row.length-1] < ERROR_MARGIN 
			//&& row[row.length-2] < ERROR_MARGIN
			//&& row[row.length-3] < ERROR_MARGIN
			//&& row[row.length-4] < ERROR_MARGIN
			) {
				return row.map(value => 0);
			} else {
				return row.map(value => value);
			}
			
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
	
	//if (IS_DEBUG) { console.log('results', results); }
	
	return results;
}

function loop() {
	leds(analizeValues(convertValuesToArr()));
}

function leds(diody) {

	//if (IS_DEBUG) {  console.log('leds', diody); }

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
	
	let send = diody.filter(dioda => dioda == 2).length == diody.length;
	
	if (isWon != send) {
		if (send === true) {
			//console.log('wlacz');
			//wlacz beacons
			exec('/home/pi/maslow/beacony_skrypty/Pygmalion/wlaczBeacon.sh', 
			(er, stdout, stderr) => console.log(er, stdout, stderr)); 
		} else if (send === false) {
			console.log('wylacz');
			exec('/home/pi/maslow/beacony_skrypty/Pygmalion/wylaczBeacon.sh', 
			(er, stdout, stderr) => console.log(er, stdout, stderr)); 
			//wylacz beacon
		}
	}
	
	isWon = send;
	
	return;		
	
	if (diody.filter(dioda => dioda == 2).length == diody.length) {
		winPin.writeSync(1);
		console.log('wygrales');
		//if (IS_DEBUG) {  console.log('wygrales'); }
	} else {
		winPin.writeSync(0);
	}
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
