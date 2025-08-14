/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import { app, ipcMain } from 'electron';
import path from 'path';

export function resolveHtmlPath(htmlFileName: string) {
    if (process.env.NODE_ENV === 'development') {
        const port = process.env.PORT || 1212;
        const url = new URL(`http://localhost:${port}`);
        url.pathname = htmlFileName;
        return url.href;
    }
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function assetsPath() {
    if (app.isPackaged) return path.join(process.resourcesPath, 'assets');
    return path.join(app.getAppPath(), 'assets');
}

export function waitForExportLoad(): Promise<void> {
    return new Promise((resolve) => {
        ipcMain.once('exportWindowLoad', () => resolve());
    });
}
