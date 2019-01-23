const $ = require('jquery');
const _ = require('lodash');
const path = require('path');
const exec = require('child_process').exec;



const PATH = path.join(__dirname);
const INTERVAL = require(PATH + '/../js/config').INTERVAL;
//const INTERVAL = 1000;
const IS_DEBUG = false;

const mcp1 = require('simple-mcp3008')(18,24,23,17,3.3);
const mcp2 = require('simple-mcp3008')(18,24,23,27,3.3);

const Gpio = require('onoff').Gpio;

const WIN_PIN = require(PATH + '/../js/config').WIN_PIN;

/** to jest wartosc sprawdzajaca odchylenie !!! */

const ERROR_MARGIN = 50;

/** tablica read only do czytania wartosci */
const arr = [
	[ { x:1, y:0, v:510, pin:mcp1.pins[0] } ],
	[ { x:0, y:1, v:510, pin:mcp1.pins[1]  }, { x:1, y:1, v:510, pin:mcp1.pins[2]  }, { x:2, y:1, v:510, pin:mcp1.pins[3]  } ],
	[ { x:0, y:2, v:508, pin:mcp1.pins[4]  } ],
	[ { x:2, y:3, v:500, pin:mcp1.pins[5]  } ],
	[ { x:1, y:4, v:390, pin:mcp1.pins[6]  } ],
	[ { x:0, y:5, v:540, pin:mcp1.pins[7]  }, { x:2, y:5, v:510, pin:mcp2.pins[0]  } ],
]

/** na ktory pin ma sie wysylac po wygranej !!! */
const winPin = new Gpio(WIN_PIN, 'out');

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
			/**
			 *
			 * 1 0 510 511 1
board_web.js:47 0 1 510 510 1
board_web.js:47 1 1 510 510 1
board_web.js:47 2 1 510 511 1
board_web.js:47 0 2 508 509 1
board_web.js:47 2 3 512 503 12
board_web.js:47 1 4 420 385 33
board_web.js:47 0 5 580 537 31
board_web.js:47 2 5 510 512 1
			 */  
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
