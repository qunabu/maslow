import { findDifference, initState } from "./logic_web.js";

let blocksState = initState.slice();

function getChange() {

    let newBlockState = convertValuesToArr(fetchValues());
	
	console.log(fetchValues());

    let change = findDifference(blocksState, newBlockState);

    if (change) {
        blocksState = newBlockState;
        return change;

    }

    return null;

}

function leds(diody) {

    diody.forEach((dioda, ii) => {
        let i = (diody.length - 1) - ii;
        switch (dioda) {
            case 2: // zielony 			
                $('div').eq(i).removeClass('fail'); //wylacz czerwony
                $('div').eq(i).addClass('ok'); //wylacz zielony
                break;
            case 1: // czerowyny
                $('div').eq(i).removeClass('ok'); //wlacz czerwony
                $('div').eq(i).addClass('fail'); //wylacz zielony
                break;
            case 3: // w dobrym rzedzie sa
            case 0: // pusty
                $('div').eq(i).removeClass('ok'); //wylacz czerwony
                $('div').eq(i).removeClass('fail'); //wylacz zielony
                break;
            default:
                break;
        }
    });

    return (diody.filter(dioda => dioda == 2).length == diody.length)

    /*
    diody.forEach((dioda, ii) => {
        let i = (diody.length - 1) - ii;
        switch (dioda) {
            case 2: // zielony 			
                ledPins[i][1].writeSync(0); //wylacz czerwony
                ledPins[i][0].writeSync(1); //wylacz zielony
                break;
            case 1: // czerowyny
                ledPins[i][1].writeSync(1); //wlacz czerwony
                ledPins[i][0].writeSync(0); //wylacz zielony
                break;
            case 3: // w dobrym rzedzie sa
            case 0: // pusty
                ledPins[i][0].writeSync(0); //wylacz czerwony
                ledPins[i][1].writeSync(0); //wylacz zielony
            default:
        }
    })
    */
}

function init(state = blocksState) {

    state.forEach((row, y) => {
        let $div = $('<div></div>');
        $('main').append($div);
        row.forEach((i, x) => {
            $div.append(
                `<select data-x="${x}" data-y="${y}">
                    <option value=0>x</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>`

                //`<input type="checkbox" maxlength="1" data-x="${x}" data-y="${y}" " pattern="[0-5]{1}"/>`
            );
        });

    });

    $('div').each((y, div) => {
        $(div).find('select').each((x, select) => {
            //$(select).val(y + 1);
        });
    });



}

/** 
 * i - rzad
 * value -wartosc pina 
 * returns 
 * - 0 - nie ma wlozonego zadnego klocka
 * - 1 - jest wlozony zly klocek 
 * - 2 - jest wlozony dobry klocek 
 */
function valueForRow(y, value) {

    if (value == 'x') {
        return 0;
    }

    if (parseInt(value) == y + 1) {
        return 1;
    }

    return -1;

}

let avrValues = initState.map((row,y) => {
	return row.map((col,x) => {
		return [];
	});
})

const AVR_BREAK = 10;

function fetchValues() {
	

    avrValues[4][5].push(  $('select[data-x=5][data-y=4]').val());
    avrValues[4][4].push(  $('select[data-x=4][data-y=4]').val());
    avrValues[4][3].push(  $('select[data-x=3][data-y=4]').val());
    avrValues[4][2].push(  $('select[data-x=2][data-y=4]').val());
    avrValues[4][1].push(  $('select[data-x=1][data-y=4]').val());
    avrValues[4][0].push(  $('select[data-x=0][data-y=4]').val());
    avrValues[3][4].push(  $('select[data-x=4][data-y=3]').val());
    avrValues[3][3].push(  $('select[data-x=3][data-y=3]').val());
    avrValues[3][2].push(  $('select[data-x=2][data-y=3]').val());
    avrValues[3][1].push(  $('select[data-x=1][data-y=3]').val());
    avrValues[3][0].push(  $('select[data-x=0][data-y=3]').val());
    avrValues[2][3].push(  $('select[data-x=3][data-y=2]').val());
    avrValues[2][2].push(  $('select[data-x=2][data-y=2]').val());
    avrValues[2][1].push(  $('select[data-x=1][data-y=2]').val());
    avrValues[2][0].push(  $('select[data-x=0][data-y=2]').val());
    avrValues[1][2].push(  $('select[data-x=2][data-y=1]').val());
    avrValues[1][1].push(  $('select[data-x=1][data-y=1]').val());
    avrValues[1][0].push(  $('select[data-x=0][data-y=1]').val());
    avrValues[0][1].push(  $('select[data-x=1][data-y=0]').val());
    avrValues[0][0].push(  $('select[data-x=0][data-y=0]').val());
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
	
	return avrValues.map((row,y) => {
		return row.map((col,x) => {
			return col.reduce(function(previousValue, currentValue, index, array) {
				  return parseInt(previousValue) + parseInt(currentValue);
			}) / col.length;
			//return col[0];
			//return [];
		});
	})
    return values;
}

function convertValuesToArr(arr) {
    let results = arr.map((row, y) => row.map((value, x) => valueForRow(y, value)));


    return results;
}

export {
    init,
    leds,
    valueForRow,
    convertValuesToArr,
    fetchValues,
    getChange
};
