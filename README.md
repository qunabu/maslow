# reqs
* `SPI` enabled
* node version 8.12 (google 'install node on raspian')
* for electron (devices that use touchscreen) 8.0.0 installed with `nvm` (`/home/pi/.nvm/versions/node/v8.0.0/bin/node` is being called by scripts)
* for electron use version globally `8.0.0` `nvm default 8.0.0`

# install 
1. clone files to main folder `git clone git@github.com:qunabucom/maslow.git`
2. install dependencies 
* `cd maslow`
* `npm install`
3. run each device with `.sh` script in main folder 

# startup script 
1. `nano ~/.config/lxsession/LXDE-pi/autostart` 
2. add there line at the end of the file depening on the machine 
`@lxterminal -e /home/pi/maslow/pygmalion1.sh`
`@lxterminal -e /home/pi/maslow/pygmalion2.sh`
`@lxterminal -e /home/pi/maslow/board.sh`
`@lxterminal -e /home/pi/maslow/piramida.sh`
`@lxterminal -e /home/pi/maslow/circle.sh`

# config 
* all files are independent and are in the folders attached to machine name `pygmalion1`, `pygmalion2`, `board`, `piramida`, `circle`, 
* most of the config are in `config.js` files
* documenation is in folder `doc` in each of the above 

# testing 
* there is global `test.sh` script to get the decimal results of all the `mcp3008`s. 

# desktop shortcuts 
* copy all `*.desktop` files to `/home/pi/Desktop` to get desktop shortcuts

# default `mcp3008` settings
* [onoff](https://www.npmjs.com/package/onoff) documention
```javascript
const mcp1 = require('simple-mcp3008')(18,24,23,17,3.3);
const mcp2 = require('simple-mcp3008')(18,24,23,27,3.3);
const mcp3 = require('simple-mcp3008')(18,24,23,25,3.3);
```