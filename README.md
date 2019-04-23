# startup script 

1. `nano ~/.config/lxsession/LXDE-pi/autostart` 
2. add there line
`@sudo /home/pi/maslow/start.sh`
3. in `start.sh` put 
`/usr/bin/node /home/pi/maslow/eight.js`
