//const a = require("./hardware.js");

let initState = [
/*0*/	[0,0],
/*1*/	[0,0],
/*2*/	[0,0],
/*3*/	[0,0],
]


let currentState = initState.slice();

function setChange(change = null) {
    
    if (change) {
		
		console.log('change', change);
        
        let newState = currentState.slice();

        if (change.to == -1 || change.to == 0) {
            /** zaznacz wszystkie do gory jako 0 */

            newState[change.y][change.x] = change.to;

            newState = newState.map((row,y) => {
                return row.map((value,x) => {
                    if (y < change.y) {
                        return 0;
                    }
                    return value;
                });
            });

            currentState = newState;

        } else {

            let currentRowsState = analizeValues(currentState);
            let currentPrevRowState = (currentRowsState[ currentRowsState.length - change.y - 2 ]);
            
            currentState = newState;	

            /** pozwol zmienic tylko jezeli poprzedni jest ulozony lub jest pierwszy od dolu */
            if (currentPrevRowState == undefined || currentPrevRowState == 2) {
				
				/** pozwol zmieni jezeli rzad powyzej jest pusty */
				
				let sstate = change.state[change.y - 1];
				
				let summ = sstate ? sstate.reduce(function(previousValue, currentValue, index, array) {
					return parseInt(previousValue) + parseInt(currentValue);
					})  : -1;
					
					
				/**
				 *  pozwol zmieni jezeli rzad powyzej jest pusty 
				 * 
				 */
				//if (summ < 1 || true) { // To mozna wylaczyc 
				
					
					 newState[change.y][change.x] = change.to;

					currentState = newState;	
					
				//}
				
				
				
				
				//console.log(change.state[change.y - 1]);
				
               
                
                //console.log(change);

            }
        }      
        
        console.log( currentState );
       
    }

    return currentState;
    
}

function findDifference(arr1, arr2) {

    let change = null;

    arr1.forEach((row, y) => {
        row.forEach((value, x) => {
            if (arr1[y][x] != arr2[y][x]) {
                change = {
                    from: arr1[y][x],
                    to: arr2[y][x],
                    x,
                    y
                };
            }
        });
    });

    return change;

}

function analizeValues(arr) {
    
    //console.log('anal', arr);

    let results = arr.map((value, index, array) => { // sprawdza czy sa wszystkie w rzedzie od gory do dolu

            let ilosc_zaznaczoncyh = value.filter(i => i != 0).length;
            let ilosc_poprawnych = value.filter(i => i == 1).length;
            let ilosc_niepoprawnych = value.filter(i => i == -1).length;

            if (ilosc_niepoprawnych > 0) {
                return 1;
            }

            if (ilosc_zaznaczoncyh == value.length) {
                if (ilosc_poprawnych == value.length) {
                    return 2; // rzad jest ok
                }
                return 1; // nie jest ok
            }

            if (ilosc_niepoprawnych == 0 && ilosc_poprawnych > 0) {
                return 1; // zawsze zle 
                //return 3; // klocek jest polozony w dobrym rzedzie ale trzeba sprawdzic czy porzedni rzad jest ok, bo jak nie to ma czerwono go 
            }

            return 1; // zawsze zle;
            //return 0; // nie sa wszystkie polozone klocki 

        })

        .reverse() // odwraca tablice

        .map((dioda, index, array) => { // sprawdza czy sa po kolei 
            if (index == 0) {
                return dioda;
            }
            let prevDioda = array[index - 1];
            if (prevDioda == 2 && dioda == 2) { // jezeli poprzedni rzad  jest 2 i ten jest  2 to ok
                return 2;
            }

            if (prevDioda != 2 && dioda == 3) { // klocek jest polozony w dobrym rzedzie ale trzeba sprawdzic czy porzedni rzad jest ok, bo jak nie to ma czerwono go 
                return 1;
            }


            dioda = dioda == 2 ? 1 : dioda; // jezeli ten jest 2 to zamien na 1
            return dioda;
        })

        .map((dioda, index, array) => { // sprawdza czy sa po kolei                 
            if (index && dioda > 0 && array[index - 1] != 2) {
                return 1;
            }
            if (index && array[index - 1] != 2) {
                return 1; //zawsze zle
                //return 0; //tylko sprawdzaj jezeli poprzedni rzad jest zielony
            }
            return dioda;
        }); //.map((dioda)=> dioda == 1 ? 1 : -1) // jest albo czerowny albo zielony
        
        

    return results;

}

module.exports = {
    initState,
    analizeValues,
    findDifference,
    setChange
};

/*
export {
    initState,
    analizeValues,
    findDifference,
    setChange
};

*/
