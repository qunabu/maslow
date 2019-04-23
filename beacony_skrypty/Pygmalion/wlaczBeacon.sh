UUID='70 6F 3F 8F 64 91 4B EE 95 F7 D8 CC 64 A8 63 74'
MAJOR='00 01'
MINOR='00 05'
POWER='C8 00'
sudo hciconfig hci0 up
sudo hciconfig hci0 leadv 3
sudo hciconfig hci0 noscan
sudo hcitool -i hci0 cmd 0x08 0x0008 1E 02 01 1A 1A FF 4C 00 02 15 $UUID $MAJOR $MINOR $POWER
