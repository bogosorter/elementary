import { exec } from 'child_process';
import { promisify } from 'util';
import { unlink, writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { basename, join, dirname } from 'path';
import { BrowserWindow } from 'electron';
import { assetsPath, waitForExportLoad } from './util';
import createWindow from '../createWindow';
const execAsync = promisify(exec);

export async function pandocAvailable() {
    try {
        await execAsync('pandoc --version');
        return true;
    } catch {
        return false;
    }
}

export async function exportToPDF(input: string, output: string) {
    const window = await createWindow('export', input);
    await waitForExportLoad();

    const pdfData = await window.webContents.printToPDF({
        printBackground: true
    });
    writeFile(output, pdfData);
    return true;
}
