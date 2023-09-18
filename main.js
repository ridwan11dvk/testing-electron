let path = require("path");
var nodeConsole = require("console");
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
const { app, BrowserWindow, desktopCapturer, ipcMain, systemPreferences, screen } = require("electron");
const electron = require('electron');
let mainWindow = null;


function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Main Window",
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "script.js"),
      sandbox: false
    },
  });
  // desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
  //   for (const source of sources) {
  //     if (source.name === 'Electron') {
  //       mainWindow.webContents.send('SET_SOURCE', source.id)
  //       return
  //     }
  //   }
  // })
  mainWindow.loadFile(path.join(__dirname, "main-window.html"));
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('force-device-scale-factor', '2'); // Adjust the scale factor as needed

app.on("ready", () => {
  // systemPreferences.isTrustedAccessibilityClient(true)
  systemPreferences.getMediaAccessStatus('screen')
  createMainWindow();
});

ipcMain.on("screenshot:capture", (e, value) => {
  const displays = screen.getAllDisplays();
const primaryDisplay = screen.getPrimaryDisplay();

  desktopCapturer
    .getSources({
      types: ['screen'],
      thumbnailSize: {
        width: primaryDisplay.size.width,
        height: primaryDisplay.size.height,
      }
      // thumbnailSize: {width: 1920, height:1000}
    })

    .then((sources) => {
      myConsole.log("sources", sources);
        let image = sources[0].thumbnail.toDataURL();
        mainWindow.webContents.send("screenshot:captured", image);
        // if (source.name === "Electron") {
        //   mainWindow.webContents.send("SET_SOURCE", source.id);
        //   return;
        // }
      // let image = sources[0].thumbnail.toDataURL();
      // mainWindow.webContents.send("screenshot:captured", image)
    });
});