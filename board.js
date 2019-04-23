// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
var path = require('path');
const PATH = path.join(__dirname);
let mainWindow

function createWindow () {

  mainWindow = new BrowserWindow({width: 1024, height: 600, frame: false, fullscreen:true})
 
  let startHTML = path.join(__dirname, 'board/assets', 'board.html');

 
  mainWindow.loadURL('file://' + startHTML);

  // Open the DevTools.
  // AAAA uncomment this foe testting
  ///mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
   
    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
