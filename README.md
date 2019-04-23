# HighGrade-Qunabu boards
## RasperryPI Raspian requirements 
### This should be installed and enabled before next steps
* `SPI` enabled
* node version 8.12 (google 'install node on raspian')
* for electron (devices that use touchscreen) 8.0.0 installed with `nvm` (`/home/pi/.nvm/versions/node/v8.0.0/bin/node` is being called by scripts)
* for electron use version globally `8.0.0` `nvm default 8.0.0`

## Installation tutorial 
1. clone files to main folder `git clone git@github.com:qunabucom/maslow.git`
2. install dependencies 
* `cd maslow`
* `npm install`
3. run each device with `.sh` script in main folder 

## Startup Script 
To make the app run on startup of the raspian to the following
1. Edit autostart script with `nano ~/.config/lxsession/LXDE-pi/autostart` 
2. Add there *one line* at the end of the file depening on the machine 
`@lxterminal -e /home/pi/maslow/pygmalion1.sh`
`@lxterminal -e /home/pi/maslow/pygmalion2.sh`
`@lxterminal -e /home/pi/maslow/board.sh`
`@lxterminal -e /home/pi/maslow/piramida.sh`
`@lxterminal -e /home/pi/maslow/circle.sh`

## Configuration
* all files are independent and are in the folders attached to machine name `pygmalion1`, `pygmalion2`, `board`, `piramida`, `circle`, 
* most of the config are in `config.js` files
* documenation is in folder `doc` in each of the above 

## Testing 
* There is global `test.sh` script to get the decimal results of all the `mcp3008`s. If this shows 0s from top to bottom, then wireing is fucked. 

## Desktop shortcuts 
* copy all `*.desktop` files to `/home/pi/Desktop` to get desktop shortcuts

## Default `mcp3008` settings
* [onoff](https://www.npmjs.com/package/onoff) documention
```javascript
const mcp1 = require('simple-mcp3008')(18,24,23,17,3.3);
const mcp2 = require('simple-mcp3008')(18,24,23,27,3.3);
const mcp3 = require('simple-mcp3008')(18,24,23,25,3.3);
```