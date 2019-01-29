const $ = require('jquery');
const _ = require('lodash');
const path = require('path');
const exec = require('child_process').exec;



const PATH = path.join(__dirname);
const INTERVAL = require(PATH + '/../js/config').INTERVAL;
//const INTERVAL = 1000;
const IS_DEBUG = false;
const ERROR_MARGIN = 20;
const AVR_BREAK = 10;

const mcp1 = require('simple-mcp3008')(18,24,23,17,3.3);
const mcp2 = require('simple-mcp3008')(18,24,23,27,3.3);

const Gpio = require('onoff').Gpio;

/** to jest wartosc sprawdzajaca odchylenie !!! */

function avr(avrValues) {
	

	/** wylicz srednia, 
	 * ale ignoruj wartosci zerowe !!!
	 * jezeli sa same zero to zwroc zero
	 *  */
	 
	if (avrValues[avrValues.length-1] < ERROR_MARGIN) {
		return 0;
	}
		
	
	let result = avrValues.filter(value => value > ERROR_MARGIN);
	
	if (result.length) {
		
		return result.reduce(function(previousValue, currentValue, index, array) {
		  return parseInt(previousValue) + parseInt(currentValue);
		}) / result.length;	
		
	} else {
		
		return 0;
	}
						
}

/** tablica read only do czytania wartosci */
const arr = [
	[ { x:1, y:0, v:510, pin:mcp1.pins[0] } ],
	[ { x:0, y:1, v:510, pin:mcp1.pins[1]  }, { x:1, y:1, v:510, pin:mcp1.pins[2]  }, { x:2, y:1, v:510, pin:mcp1.pins[3]  } ],
	[ { x:0, y:2, v:508, pin:mcp1.pins[4]  } ],
	[ { x:2, y:3, v:500, pin:mcp1.pins[5]  } ],
	[ { x:1, y:4, v:420, pin:mcp1.pins[6]  } ],
	[ { x:0, y:5, v:580, pin:mcp1.pins[7]  }, { x:2, y:5, v:510, pin:mcp2.pins[0]  } ],
]


let isWon = undefined;

function win(send = false) {
		
	if (isWon != send) {
		if (send === true) {
			//console.log('wlacz');
			//wlacz beacons
			exec('/home/pi/maslow/beacony_skrypty/McGregor/wlaczBeacon.sh', 
			(er, stdout, stderr) => console.log(er, stdout, stderr)); 
		} else if (send === false) {
			//console.log('wylacz');
			exec('/home/pi/maslow/beacony_skrypty/McGregor/wylaczBeacon.sh', 
			(er, stdout, stderr) => console.log(er, stdout, stderr)); 
			//wylacz beacon
		}
	}
	isWon = send;
	return;

}

function loop() {
		
	let i = arr.filter((vrr,y) => {		
		return vrr.length == vrr.filter((row,x) => {
			if (IS_DEBUG) {
				console.log(row.x, row.y, row.v, row.pin.getDecimalValue(), Math.abs(row.pin.getDecimalValue() - row.v));
			}
			if (typeof row.arr == 'undefined') {
				row.arr = [];
			}
			if (row.arr.length > AVR_BREAK) {
				row.arr.shift( );
			}
			row.arr.push(row.pin.getDecimalValue());
			row.avr = avr(row.arr);
			
			//console.log(row.avr);
			
			console.log(`x:${row.x} y:${row.y}`, row.pin.getDecimalValue());
			
			
			return Math.abs(row.avr - row.v) < ERROR_MARGIN;		
			return Math.abs(row.pin.getDecimalValue() - row.v) < ERROR_MARGIN;			
		}).length;			
	}).length;
		
	
	showImage(i);
		
	win(i == arr.length);
		
	return;	
	
}

function showImage(i=0) {
    $('img')
        .hide()
        .eq(i)
        .show();
}

function init() {

	loop();
    setInterval(loop, INTERVAL);
}

init();
