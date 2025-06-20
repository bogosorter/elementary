import { writeFile } from 'fs/promises';
import { waitForExportLoad } from './util';
import createWindow from '../createWindow';

export async function exportToPDF(input: string, output: string) {
    const window = await createWindow('export', input);
    await waitForExportLoad();

    const pdfData = await window.webContents.printToPDF({
        printBackground: true
    });
    writeFile(output, pdfData);

    window.close();
    return true;
}
