/** PLIK konfiguracyjny !!! */

/** tutaj zmieniasz pin do iBeacona */

const WIN_PIN = 8;

/** tutaj sie usatwia marginesy rzedow od gory do doly 
 * wg schematu 
 * 	switch (i) {
	case 0:
		return value > 495 && value < 525 ? 1 : -1;
	case 1:
		return value > 405 && value < 455 ? 1 : -1;
	case 2:
		return value > 495 && value < 525 ? 1 : -1;
	case 3:
		return value > 465 && value < 515 ? 1 : -1;
	case 4:
		
 * 
 * */

const PINS_MARGINS = [
	[495,525], // [wartosc minimum, wartosc maksimum]
	[405,455], // [wartosc minimum, wartosc maksimum]
	[495,525], // [wartosc minimum, wartosc maksimum]
	[465,515], // [wartosc minimum, wartosc maksimum]
	[495,525], // [wartosc minimum, wartosc maksimum]
]

/** co ile milisek apka zczytuje wartosci z urzadzennia */

const INTERVAL = 250;

/** z ilu wartosci liczy srednia */

const AVR_BREAK = 5;

/** jezeli warto odczytu jest mniejsza niz 20 to jest wyjety klocek */
const ERROR_MARGIN = 20;

// Exec=/usr/bin/node /home/pi/maslow/raspberry.js





/** tego nie ruszac */
module.exports = {
    WIN_PIN,
    PINS_MARGINS,
    INTERVAL,
    AVR_BREAK,
    ERROR_MARGIN
};
