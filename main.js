const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const rp = require('request-promise');
let win;

global.sharedObj = { accessToken: null };

const loginRrequestOptions = {
    method: 'POST',
    uri: 'https://test-platform.welcometw.com/api/fontrip/kiosk/kioskLogin',
    headers: {
        'User-Agent': 'insomnia/5.12.4',
        'Content-Type': 'application/json',
        'secret': '4yXnWw4ggccCxA8482wJ',
        'key': '779473641250'
    },
    body: {
        "basic": {
            "appName": "kiosk",
            "appVersion": "0.5",
            "lang": "zh_TW",
            "os": "kiosk",
            "deviceId": "kiosktest",
            "latitude": "25.00",
            "longitude": "123.21"
        },
        "request": {
            "username": "kiosk@fontrip.com.tw",
            "password": "20170901",
            "accountCode": "ST64386174"
        }
    },
    json: true // Automatically stringifies the body to JSON
};

const browserWindowOptions = {
    // width: 800, height: 600,
    fullscreen: true,
    // kiosk: true,
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

app.on('ready', () => {
    console.log('app.ready()');
    rp(loginRrequestOptions)
        .then(function (data) {
            console.log('data.response.success : ' + data.response.success);
            global.sharedObj.accessToken = data.result.accessToken;
            createMain();
        })
        .catch(function (err) {
            console.error(err);
            // API call failed...
        });
});
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