import { findDifference, initState } from "./logic_web.js";

let blocksState = initState.slice();

function getChange() {

    let newBlockState = convertValuesToArr(fetchValues());

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
                    <option>x</option>
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

function fetchValues() {
    let values = [
        [0, 0],
        [0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]; // copy of the original array structure;

    values[4][5] = $('select[data-x=5][data-y=4]').val();
    values[4][4] = $('select[data-x=4][data-y=4]').val();
    values[4][3] = $('select[data-x=3][data-y=4]').val();
    values[4][2] = $('select[data-x=2][data-y=4]').val();
    values[4][1] = $('select[data-x=1][data-y=4]').val();
    values[4][0] = $('select[data-x=0][data-y=4]').val();
    values[3][4] = $('select[data-x=4][data-y=3]').val();
    values[3][3] = $('select[data-x=3][data-y=3]').val();
    values[3][2] = $('select[data-x=2][data-y=3]').val();
    values[3][1] = $('select[data-x=1][data-y=3]').val();
    values[3][0] = $('select[data-x=0][data-y=3]').val();
    values[2][3] = $('select[data-x=3][data-y=2]').val();
    values[2][2] = $('select[data-x=2][data-y=2]').val();
    values[2][1] = $('select[data-x=1][data-y=2]').val();
    values[2][0] = $('select[data-x=0][data-y=2]').val();
    values[1][2] = $('select[data-x=2][data-y=1]').val();
    values[1][1] = $('select[data-x=1][data-y=1]').val();
    values[1][0] = $('select[data-x=0][data-y=1]').val();
    values[0][1] = $('select[data-x=1][data-y=0]').val();
    values[0][0] = $('select[data-x=0][data-y=0]').val();
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