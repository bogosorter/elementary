/* eslint global-require: off, no-console: off, promise/always-return: off */

import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import mime from 'mime';
import { readFile, writeFile, access, stat } from 'fs/promises';
import { resolve as resolvePath, dirname, parse as parsePath, format as formatPath, join as joinPath } from 'path';
import settings from 'electron-settings';
import versionCheck from '@version-checker/core';
import defaultSettings, { Settings } from '../settings';
import createWindow from './createWindow';
import { exportToPDF } from './utils/export';
import { assetsPath } from './utils/util';

let window: BrowserWindow | null = null;
let preventClose = true;

app.whenReady().then(async () => {
    // Handle file opening on app startup
    if (process.argv.length >= 2) {
        const filePath = process.argv[process.argv.length - 1];

        if (filePath.endsWith('.md')) {
            try {
                await access(filePath)
                await settings.set('path', filePath);
                await updateRecentlyOpened(filePath);
            } catch {}
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
    const content = (await readFile(path)).toString();

    // Update stored information
    await settings.set('path', path);
    await updateRecentlyOpened(path);

    return { path, content };
});

// `knownModified` is the Unix timestamp of the last modification the program knows
// of. This is used to determine if there has been an external modification
// since
ipcMain.handle('save', async (_, path: string, content: string, knownModified: number) => {
    try {
        const modifiedOnDisk = (await stat(path)).mtimeMs;
        if (modifiedOnDisk > knownModified) {
            const result = await dialog.showMessageBox({
                type: 'warning',
                buttons: ['Overwrite', 'Cancel'],
                defaultId: 1,
                title: 'File Changed',
                message: 'The file has been edited externally. Overwrite?',
            });

            if (result.response === 1) return false;
        }

        await writeFile(path, content);
        return true;

    } catch {
        // If the file doesn't exist, we can just write it
        await writeFile(path, content);
        return true;
    }
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

    await writeFile(path, content);
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
    if (!path) return { path: '', content: 'hello, world' };

    try {
        await access(path);
        const content = (await readFile(path)).toString();
        return { path, content };
    } catch {
        return { path: '', content: 'hello, world' };
    }
});

ipcMain.handle('getFileContent', async (_, path: string) => {
    return (await readFile(path)).toString();
});

ipcMain.handle('loadFile', async (_, path: string) => {
    try {
        await access(path);

        // Update stored information
        await settings.set('path', path);
        await updateRecentlyOpened(path);

        const content = (await readFile(path)).toString();
        return content;
    } catch {
        return null;
    }
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

ipcMain.handle('getLocalFileBase64', async (_, basePath: string, path: string) => {
    const resolvedPath = resolvePath(dirname(basePath), path);

    try {
        await access(resolvedPath);

        // @ts-ignore
        const mimeType = mime.getType(resolvedPath)!;
        const data = (await readFile(resolvedPath)).toString('base64');

        return { mimeType, data }
    } catch {
        return null;
    }
});

ipcMain.handle('getLocalFile', async (_, basePath: string, path: string) => {
    const resolvedPath = resolvePath(dirname(basePath), path)

    try {
        await access(resolvedPath);
        return (await readFile(resolvedPath)).toString();
    } catch {
        return null;
    }
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
    try {
        await access(path);
        shell.showItemInFolder(path);
    } catch {}
});

ipcMain.handle('getText', async (_, text: 'info' | 'markdown' | 'pdfExportGuide' | 'shortcuts' | 'update' | 'math') => {
    const path = joinPath(assetsPath(), 'texts', text + '.md');
    const file = await readFile(path);
    return file.toString();
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
