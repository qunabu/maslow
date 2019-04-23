# reqs
* node version 8.12
* for electron 8.0.0 installed with `nvm` (/home/pi/.nvm/versions/node/v8.0.0/bin/node)
# install 
* `cd maslow`
* `npm install`
# startup script 

1. `nano ~/.config/lxsession/LXDE-pi/autostart` 
2. add there line
`@lxterminal -e /home/pi/maslow/pygmalion2.sh`
3. in `start.sh` put 
`/usr/bin/node /home/pi/maslow/pygmalion2.js`
