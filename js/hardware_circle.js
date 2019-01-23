
const mcp1 = require('simple-mcp3008')(18,24,23,17,3.3);
const mcp2 = require('simple-mcp3008')(18,24,23,27,3.3);
const mcp3 = require('simple-mcp3008')(18,24,23,25,3.3);
const Gpio = require('onoff').Gpio;
const path = require('path');

/** na ktory pin ma sie wysylac po wygranej !!! */
const winPin = new Gpio(8, 'out');

const PATH = path.join(__dirname);
const AVR_BREAK = require(PATH + '/config').AVR_BREAK;
const ERROR_MARGIN = require(PATH + '/config').ERROR_MARGIN;

let avrValues = Array.from({length: 10}, (v, k) => []); 
let blocksState = Array.from({length: 10}, (v, k) => 0); 
//avrValues = avrValues.map(row => []);


let isWon = undefined;

function win(send = false) {
		
	if (isWon != send) {
		if (send === true) {
			//console.log('wlacz');
			//wlacz beacons
			exec('/home/pi/maslow/beacony_skrypty/Herzberg/wlaczBeacon.sh', 
			(er, stdout, stderr) => console.log(er, stdout, stderr)); 
		} else if (send === false) {
			//console.log('wylacz');
			exec('/home/pi/maslow/beacony_skrypty/Herzberg/wylaczBeacon.sh', 
			(er, stdout, stderr) => console.log(er, stdout, stderr)); 
			//wylacz beacon
		}
	}
	isWon = send;
	return;

}

/*
function win(send = false) {
	if (send) {
		winPin.writeSync(1);
	} else {
		winPin.writeSync(0);
	}	
}
*/

function getChange() {
	
	let values = fetchValues();
	
    let newBlockState = convertValuesToArr(values);
	
    let change = findDifference(blocksState, newBlockState);

    if (change) {
        blocksState = newBlockState;
        //get all values 
        change.summ = values.reduce(function(previousValue, currentValue, index, array) {
		  return parseInt(previousValue) + parseInt(currentValue);
		})
        return change;

    }

    return null;

}

function valueForRow(value) {

    if (value < 20) {
        return 0;
    }
    
    if (value < 220) {
		return 3
	}
    
    if (value > 500 && value < 520) {
		return 1;
	}
	
	if (value > 514) {
		return 2;
	}
	
	return 3;
	
}



function convertValuesToArr(arr) {
    let results = arr.map(value => valueForRow(value));
    return results;
}

function fetchValues() {
	
	/** TODO push values into array and remove remove tail */
	
    
   
    
    avrValues[0].push( mcp1.pins[0].getDecimalValue() );
    avrValues[1].push( mcp1.pins[1].getDecimalValue() );
    avrValues[2].push( mcp2.pins[0].getDecimalValue() );
    avrValues[3].push( mcp2.pins[1].getDecimalValue() );
    avrValues[4].push( mcp2.pins[2].getDecimalValue() );
    avrValues[5].push( mcp2.pins[3].getDecimalValue() );
    avrValues[6].push( mcp2.pins[4].getDecimalValue() );
    avrValues[7].push( mcp2.pins[5].getDecimalValue() );
    avrValues[8].push( mcp2.pins[6].getDecimalValue() );
    avrValues[9].push( mcp2.pins[7].getDecimalValue() );
    
    
    if (avrValues[0].length > AVR_BREAK) {
		avrValues[1].shift( );
		avrValues[2].shift( );
		avrValues[3].shift( );
		avrValues[4].shift( );
		avrValues[5].shift( );
		avrValues[6].shift( );
		avrValues[7].shift( );
		avrValues[8].shift( );
		avrValues[9].shift( );
	}
	
	/** jezeli ostatni jest wlozony na zero to wyzeruj cala historie */

		
		
	avrValues = avrValues.map((row,y) => {
		if (row[row.length-1] < ERROR_MARGIN && row[row.length-2] < ERROR_MARGIN) {
				return row.map(value => 0)
		}
		return row;
	})
	
	
	
	
	return avrValues.map((row,y) => {
		
			/** wylicz srednia, 
			 * ale ignoruj wartosci zerowe !!!
			 * jezeli sa same zero to zwroc zero
			 *  */
			
			let result = row.filter(value => value > ERROR_MARGIN);
			
			if (result.length) {
				
				return result.reduce(function(previousValue, currentValue, index, array) {
				  return parseInt(previousValue) + parseInt(currentValue);
				}) / result.length;	
				
			} else {
				
				return 0;
			}
						
						
		
	})
    
    /** return avrages */
    
    return values;
}

function findDifference(arr1, arr2) {

    let change = null;

	arr1.forEach((value, x) => {
		if (arr1[x] != arr2[x]) {
			change = {
				from: arr1[x],
				to: arr2[x],
				x				
			};
		}
	});

    return change;

}

module.exports = {
    win,
    getChange
    
};
