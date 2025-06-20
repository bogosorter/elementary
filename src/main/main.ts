/* eslint global-require: off, no-console: off, promise/always-return: off */

import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import fs from 'fs';
import mime from 'mime';
import { resolve as resolvePath, dirname, parse as parsePath, format as formatPath } from 'path';
import settings from 'electron-settings';
import versionCheck from '@version-checker/core';
import defaultSettings, { Settings } from '../settings';
import createWindow from './createWindow';
import { exportToPDF } from './utils/export';

let window: BrowserWindow | null = null;
let preventClose = true;

app.whenReady().then(async () => {
    // Handle file opening on app startup
    if (process.argv.length >= 2) {
        const filePath = process.argv[process.argv.length - 1];
        if (fs.existsSync(filePath) && filePath.endsWith('.md')) {
            await settings.set('path', filePath);
            await updateRecentlyOpened(filePath);
        }
    }

    window = await createWindow('main');

    // Instead of closing the window, check if all files are saved
    window.on('close', (e) => {
        if (preventClose) {
            e.preventDefault();
            window!.webContents.send('close');
        }
    });
}).catch(console.log);

ipcMain.handle('open', async () => {
    const result = await dialog.showOpenDialog(window!, {
        properties: ['openFile'],
        filters: [{ name: 'Markdown', extensions: ['md'] }],
    });
    if (result.canceled) return null;

    const path = result.filePaths[0];
    const content = fs.readFileSync(path).toString();

    // Update stored information
    await settings.set('path', path);
    await updateRecentlyOpened(path);

    return { path, content };
});

ipcMain.handle('save', async (_, path: string, content: string) => {
    fs.writeFileSync(path, content);
    return path;
});

ipcMain.handle('saveAs', async (_, content: string) => {
    const result = await dialog.showSaveDialog(window!, {
        filters: [{ name: 'Markdown', extensions: ['md'] }],
    });
    if (result.canceled) return null;

    const path = result.filePath!;

    // Update stored information
    await settings.set('path', path);
    await updateRecentlyOpened(path);

    fs.writeFileSync(path, content);
    return path;
});

async function getSettings()  {
    const saved = await settings.get('settings');
    if (!saved) return defaultSettings;

    // Ensure compatibility after updates
    const result = { ...defaultSettings, ...saved as Settings };
    return result;
}

ipcMain.handle('getSettings', async () => {
    return getSettings();
});

ipcMain.on('setSettings', async (_, value: Settings) => {
    await settings.set('settings', value);
});

ipcMain.handle('getLastFile', async () => {
    const path = await settings.get('path') as string;
    if (!path || !fs.existsSync(path)) return { path: '', content: 'Hello world!' };
    const content = fs.readFileSync(path).toString();
    return { path, content };
});

ipcMain.handle('getFileContent', async (_, path: string) => {
    return fs.readFileSync(path).toString();
});

ipcMain.handle('loadFile', async (_, path: string) => {
    if (!fs.existsSync(path)) return null;

    // Update stored information
    await settings.set('path', path);
    await updateRecentlyOpened(path);

    const content = fs.readFileSync(path).toString();
    return content;
});

ipcMain.handle('getRecent', async () => {
    const recent = await settings.get('recent');
    return recent || [];
});

async function updateRecentlyOpened(path: string) {
    const recent = ((await settings.get('recent') || []) as string[]).filter((p) => p !== path);
    recent.unshift(path);
    if (recent.length > 100) recent.pop();
    await settings.set('recent', recent);
}

ipcMain.on('window', (_, action: string) => {
    if (action == 'close') {
        // We have to prevent the default close handler. If we don't, we'll
        // enter in an infinite loop of closing, checking if a file can be
        // closed, closing again, etc.
        preventClose = false;
        window!.close();
    }
    else if (action == 'minimize') window!.minimize();
    else if (window?.isMaximized()) window!.unmaximize();
    else window!.maximize();
});

ipcMain.handle('showSaveDialog', async () => {
    const { response } = await dialog.showMessageBox(window!, {
        type: 'warning',
        message: 'Save current file?',
        buttons: ['Cancel', 'No', 'Yes'],
        defaultId: 2
    });

    return response;
});

ipcMain.handle('getLocalFileBase64', (_, basePath: string, path: string) => {
    const resolvedPath = resolvePath(dirname(basePath), path);
    if (!fs.existsSync(resolvedPath)) return null;

    const mimeType = mime.getType(resolvedPath)!;
    const data = fs.readFileSync(resolvedPath).toString('base64');

    return { mimeType, data }
});

ipcMain.handle('getLocalFile', (_, basePath: string, path: string) => {
    const resolvedPath = resolvePath(dirname(basePath), path)
    if (!fs.existsSync(resolvedPath)) return null;

    return fs.readFileSync(resolvedPath).toString();
});

ipcMain.handle('exportToPDF', async (_, mdPath: string) => {
    const automaticExportFilename = (await getSettings()).automaticExportFilename;

    let pdfPath = '';
    if (automaticExportFilename) {
        const parsed = parsePath(mdPath);
        parsed.ext = '.pdf';
        parsed.base = parsed.name + parsed.ext;
        pdfPath = formatPath(parsed);
    } else {
        const result = await dialog.showSaveDialog(window!, {
            filters: [{ name: 'PDF', extensions: ['pdf'] }]
        });
        if (result.canceled) return 'canceled';

        pdfPath = result.filePath!;
    }

    const success = await exportToPDF(mdPath, pdfPath);
    if (!success) return 'error';
    return pdfPath;
});

ipcMain.on('showInFolder', async (_, path: string) => {
    if (!fs.existsSync(path)) return;
    shell.showItemInFolder(path);
});

ipcMain.handle('checkForUpdates', async () => {
    const prereleaseNotification = (await getSettings()).prereleaseNotification;

    try {
        const result = await versionCheck({
            repo: 'elementary',
            owner: 'bogosorter',
            currentVersion: app.getVersion(),
            excludePrereleases: !prereleaseNotification
        });

        return result.update;
    } catch (e) {
        // Probably failed due to network error
        return false;
    }
});

ipcMain.handle('getVersionInfo', async () => {
    const firstTime = await settings.get('appUsed')? false : true;
    await settings.set('appUsed', true);

    const previousVersion = await settings.get('version') || app.getVersion();
    const update = previousVersion !== app.getVersion();
    await settings.set('version', app.getVersion());

    return { firstTime, update };
});
