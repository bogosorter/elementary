import { exec } from 'child_process';
import { promisify } from 'util';
import { unlink, writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { basename, join, dirname } from 'path';
import { BrowserWindow } from 'electron';
import { assetsPath } from './util';
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
    const htmlPath = join(dirname(input), `${basename(input, '.md')}_elementary_temp.html`);
    const exportPath = join(assetsPath(), 'export');
    const cssPath = join(exportPath, 'github.css');
    const highlightCssPath = join(exportPath, 'highlight.css');
    const templatePath = join(exportPath, 'export.html');

    try {
        await execAsync(`pandoc "${input}" -o "${htmlPath}" --template="${templatePath}" --css="${cssPath}" --css="${highlightCssPath}" --embed-resources --standalone`);
        await htmlToPdf(htmlPath, output);
        await unlink(htmlPath);
        return true;
    } catch (e) {
        console.log(e);
        if (existsSync(htmlPath)) unlink(htmlPath);
        return false;
    }
}

async function htmlToPdf(filePath: string, outputPdfPath: string) {
    const win = new BrowserWindow({ show: false });
    await win.loadFile(filePath);

    const highlightJSFile = join(assetsPath(), 'export', 'highlight.js');
    const highlightJSContent = await readFile(highlightJSFile, 'utf-8');
    await win.webContents.executeJavaScript(highlightJSContent);
    await win.webContents.executeJavaScript('hljs.highlightAll();');

    const pdfData = await win.webContents.printToPDF({});
    writeFile(outputPdfPath, pdfData);

    win.close();
}
