import path from 'path';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './utils/util';
import { shell, app, BrowserWindow } from 'electron';

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
if (isDebug) {
    require('electron-debug')();
}

async function installExtensions() {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer.default(extensions.map((name) => installer[name]), forceDownload);
}

export default async function createWindow(windowType: 'main' | 'export', exportFile?: string) {
    if (isDebug) {
        await installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, 'assets')
        : path.join(__dirname, '../../assets');

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    const window = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        minHeight: 350,
        minWidth: 400,
        icon: getAssetPath('icon.png'),
        webPreferences: {
            preload: app.isPackaged
                ? path.join(__dirname, 'preload.js')
                : path.join(__dirname, '../../.erb/dll/preload.js'),
            additionalArguments: [windowType, `exportFile="${encodeURIComponent(exportFile ?? '')}"`],
        },
        frame: false,
    });

    window.loadURL(resolveHtmlPath('index.html'));

    // Event listeners shouldn't be set on export windows, as they are never displayed.
    if (windowType === 'export') return window;

    window.on('ready-to-show', () => {
        if (process.env.START_MINIMIZED) {
            window.minimize();
        } else {
            window.maximize();
            window.show();
        }
    });

    window.on('enter-full-screen', () => {
        window.webContents.send('toggleFullscreen');
    });

    window.on('leave-full-screen', () => {
        window.webContents.send('toggleFullscreen');
    });

    const menuBuilder = new MenuBuilder(window);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    window.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: 'deny' };
    });

    return window;
};
