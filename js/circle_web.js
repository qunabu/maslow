const $ = require('jquery');
const _ = require('lodash');
const path = require('path');

const PATH = path.join(__dirname);
const INTERVAL = require(PATH + '/../js/config').INTERVAL;
const IS_DEBUG = true;
const winArr = [1,1,1,1,1,2,2,2,2,2];
let _currArr = [];
let _currI = -1;

function loop() {
    const currArr = getCurrArr()
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

function setI(i) {
    if (i == _currI) {
        return 0;
    }
    _currI = i;
    showImage(_currI);
    if (_currI == 0) {
        _currI = 1;
        setTimeout(() => showImage(1), 1000)
    }
}

function getI() {
    return _currI;
}

function reset() {
    if (getCurrArr().length != 0) {
        _currArr = [];
    }
    setI(1);
}

function wrong() {
    _currArr = [];
    setI(0);
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