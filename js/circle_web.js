const $ = require('jquery');
const _ = require('lodash');
const path = require('path');
const exec = require('child_process').exec;


const PATH = path.join(__dirname);
const INTERVAL = require(PATH + '/../js/config').INTERVAL;
const IS_DEBUG = false;


//const fetchValues = require(PATH + '/../js//hardware_circle').fetchValues;
const getChange = require(PATH + '/../js//hardware_circle').getChange;
const win = require(PATH + '/../js//hardware_circle').win;

const winArr = [1,1,1,1,1,2,2,2,2,2];
let _currArr = [];
let _currI = -1;
let _summVols = 0;

function loop() {
	let change = getChange() ;
	
	if (change) {
		//console.log(change);
		_summVols = change.summ;
		if (change.to) {
			pushCurrArr(change.to);
		} else {
			//reset();
			popCurrArr(change.from);
		}
	}
	//console.log(fetchValues());
	const currArr = getCurrArr();
	
	//console.log(currArr);
	if (currArr.length) {
		if (compare(currArr, winArr)) {
			setI(currArr.length + 1);
		} else {
			wrong();
		}
	} else {
		reset();
	}
	
	
}

function compare(_arr1, _arr2) {
    return _.isEqual(_arr1, _arr2.slice(0, _arr1.length));
}

function getCurrArr() {
    return _currArr;
}

function pushCurrArr(i) {
    _currArr.push(i);
}

function popCurrArr(i) {
	if (_currArr[_currArr.length -1] == i) {
		_currArr.pop();
	} else {
		wrong();
	}
}

function setI(i) {
	
	//console.log('seti',_currI, i, getCurrArr());
	
	win(i == 11) 
		
    if (i == _currI) {
        return 0;
    }
    
    if (_currI == 0) {
		
		if (getCurrArr().length != 0) {
			return;
		}
		
        //_currI = 1;
        //setTimeout(() => showImage(1), 1000)
    }
    
    _currI = i;
    showImage(_currI);
}

function getI() {
    return _currI;
}

function reset() {
	
    if (getCurrArr().length != 0) {
        _currArr = [];
    }
    //console.log('reset', _summVols);
    if (_summVols > 1) {
		 return;
	}
    setI(1);
}

function wrong() {
   
   // console.log('wrong', _summVols);
    setI(0);
    //if (_summVols < 1) {
		 _currArr = [];
	//}
}

function showImage(i=0) {
    $('img')
        .hide()
        .eq(i)
        .show();
}

function onBtbClick(e) {
    pushCurrArr(parseInt(e.target.innerText))
    //console.log();
}

function init() {
    if (IS_DEBUG) {
        $('body').append(`
        <div class="buttons">
            <button>1</button>
            <button>2</button>
            <button>3</button>
        </div>
        `);
    }

    $('button').click(onBtbClick);

    setInterval(loop, INTERVAL);
}

init();
