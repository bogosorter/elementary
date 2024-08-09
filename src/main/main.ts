/* eslint global-require: off, no-console: off, promise/always-return: off */

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import fs from 'fs';
import settings from 'electron-settings';
import versionCheck from '@version-checker/core';
import defaultSettings, { Settings } from '../settings';
import createWindow from './createWindow';

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

    window = await createWindow();

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
    if (path) {
        fs.writeFileSync(path, content);
        return path;
    }

    // If the file was never saved before, show save dialog
    const result = await dialog.showSaveDialog(window!, {
        filters: [{ name: 'Markdown', extensions: ['md'] }],
    });
    if (result.canceled) return;

    path = result.filePath!;

    // Update stored information
    await settings.set('path', path);
    await updateRecentlyOpened(path);

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

ipcMain.handle('getSettings', async () => {
    const saved = await settings.get('settings');
    if (!saved) return defaultSettings;

    // Ensure compatibility after updates
    const result = { ...defaultSettings, ...saved as Settings };
    return result;
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

ipcMain.handle('checkForUpdates', async () => {
    try {
        const result = await versionCheck({
            repo: 'elementary',
            owner: 'bogosorter',
            currentVersion: app.getVersion()
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
