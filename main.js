let path = require("path");
var nodeConsole = require("console");
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
const { app, BrowserWindow, desktopCapturer, ipcMain, systemPreferences } = require("electron");
let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Main Window",
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "script.js"),
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

app.on("ready", () => {
  // systemPreferences.isTrustedAccessibilityClient(true)
  systemPreferences.getMediaAccessStatus('screen')
  createMainWindow();
});

ipcMain.on("screenshot:capture", (e, value) => {
  desktopCapturer
    .getSources({
      types: ['screen'],
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
