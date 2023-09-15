const { ipcRenderer } = require("electron")
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
window.addEventListener('DOMContentLoaded', () => {
    myConsole.log('loaded')
    document.getElementById('btn').addEventListener('click', () => {
        console.log('testt')
        ipcRenderer.send("screenshot:capture", {})
    })
    ipcRenderer.on('screenshot:captured', (e, imageData) => {
        document.getElementById("placeholder").src = imageData
    })
})