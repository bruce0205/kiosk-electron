const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const rp = require('request-promise');
let win;
let accessToken;

const loginRrequestOptions = {
    method: 'POST',
    uri: 'https://test-platform.welcometw.com/api/fontrip/kiosk/kioskLogin',
    body: {
        some: 'payload'
    },
    json: true // Automatically stringifies the body to JSON
};

const browserWindowOptions = {
    // width: 800, height: 600,
    // fullscreen: true,
    kiosk: true,
}

function createMain() {
    if (!win) {
        win = new BrowserWindow(browserWindowOptions);

        // TODO get accessToken
        win.on('show', () => {

        });

        win.on('closed', () => {
            win = null;
        });
    }

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));


}

app.on('ready', createMain);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win == null) {
        createMain();
    }
});

ipcMain.on('openMain', (event, arg) => {
    createMain();
});

ipcMain.on('openMuseum', (event, arg) => {
    if (!win) {
        win = new BrowserWindow(browserWindowOptions);

        win.on('closed', () => {
            win = null;
        });
    }
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'product', 'museum.html'),
        protocol: 'file',
        slashes: true
    }));
});

ipcMain.on('openMuseumSuccess', (event, arg) => {
    if (!win) {
        win = new BrowserWindow(browserWindowOptions);

        win.on('closed', () => {
            win = null;
        });
    }
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'product', 'museum-success.html'),
        protocol: 'file',
        slashes: true
    }));
});

ipcMain.on('openMuseumFail', (event, arg) => {
    if (!win) {
        win = new BrowserWindow(browserWindowOptions);

        win.on('closed', () => {
            win = null;
        });
    }
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'product', 'museum-fail.html'),
        protocol: 'file',
        slashes: true
    }));
});

ipcMain.on('quitApp', (event, arg) => {
    app.quit();
});