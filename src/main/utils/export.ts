import { exec } from 'child_process';
import { promisify } from 'util';
import { unlink } from 'fs/promises';
import { basename, join, dirname } from 'path';
import { app } from 'electron';
import { BrowserWindow } from 'electron';
import { writeFileSync } from 'original-fs';
import { readFileSync } from 'fs';
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
    const cssPath = join(app.getAppPath(), 'assets', 'export', 'github.css');
    const highlightCssPath = join(app.getAppPath(), 'assets', 'export', 'highlight.css');
    const templatePath = join(app.getAppPath(), 'assets', 'export', 'export.html');

    try {
        await execAsync(`pandoc "${input}" -o "${htmlPath}" --template="${templatePath}" --css="${cssPath}" --css="${highlightCssPath}" --embed-resources --standalone`);
        await htmlToPdf(htmlPath, output);
        await unlink(htmlPath);
        return true;
    } catch (e) {
        try {
            unlink(htmlPath);
        } catch {} // File may not have been created

        console.log(e);
        return false;
    }
}

async function htmlToPdf(filePath: string, outputPdfPath: string) {
    const highlightJSFile = join(app.getAppPath(), 'assets', 'export', 'highlight.js');

    const win = new BrowserWindow({ show: false, webPreferences: { offscreen: true } });
    await win.loadFile(filePath);
    const highlightJSContent = await readFileSync(highlightJSFile, 'utf-8');
    await win.webContents.executeJavaScript(highlightJSContent);
    await win.webContents.executeJavaScript('hljs.highlightAll();');
    const pdfData = await win.webContents.printToPDF({});
    writeFileSync(outputPdfPath, pdfData);
    win.close();
}
