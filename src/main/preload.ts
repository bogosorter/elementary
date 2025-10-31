// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent, webFrame } from 'electron';

export type Channels = 'save' | 'saveAs' | 'open' | 'window' | 'getSettings' | 'setSettings' | 'resetSettings' | 'loadFile' | 'getRecent' | 'getLastFile' | 'toggleFullscreen' | 'newWindow' | 'showSaveDialog' | 'getVersionInfo' | 'checkForUpdates' | 'close' | 'getLocalFile' | 'getLocalFileBase64' | 'exportToPDF' | 'showInFolder' | 'getFileContent' | 'exportWindowLoad' | 'getText' | 'availableDictionaries' | 'loadSpellchecker' | 'spellcheck' | 'suggest' | 'addToUserDictionary' | 'removeFromUserDictionary' | 'ignore' | 'getExportFile' | 'exportFile' | 'exportFileSync' | 'exportFileInvoke';

const electronHandler = {
  windowType: process.argv.includes('export') ? 'export' : 'main',
  exportFile: decodeURIComponent(process.argv.find(arg => arg.startsWith('exportFile='))?.split('"')[1] ?? ''),
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    send(channel: Channels, ...args: unknown[]) {
        ipcRenderer.send(channel, ...args);
    },
    sendSync(channel: Channels, ...args: unknown[]) {
        return ipcRenderer.sendSync(channel, ...args);
    },
    invoke(channel: Channels, ...args: unknown[]) {
        return ipcRenderer.invoke(channel, ...args);
    }
  },
  webFrame: {
    setZoomFactor(factor: number) {
      webFrame.setZoomFactor(factor);
    }
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
