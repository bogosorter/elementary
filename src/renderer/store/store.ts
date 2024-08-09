import { create } from 'zustand';
import * as Monaco from 'monaco-editor';
import { toast } from 'react-toastify';
import { Theme, lightTheme, darkTheme, commaTheme, createStyles } from '../../themes';
import defaultSettings, { Settings } from '../../settings';
import { configuration, tokenProvider } from '../utils/tokenProvider';
import { autoSave, cancelAutoSave } from '../utils/autosave';
import { info, markdown, shortcuts } from '../texts/texts';
import 'react-toastify/dist/ReactToastify.css';
import tagQuotes from '../utils/quotes';

type CommandPalettePage = 'general' | 'recentlyOpened' | 'zoom' | 'fontSize' | 'editorWidth' | 'interfaceComplexity' | 'autoSave' | 'lineNumbers';

type Store = {
    settings: Settings;

    path: string;
    saved: boolean;
    wordCount: number;
    characterCount: number;
    recentlyOpened: string[];

    monaco?: typeof Monaco;
    editor?: Monaco.editor.IStandaloneCodeEditor;
    shortcuts: { [key: string]: () => void };
    commandPaletteOpen: boolean;
    commandPalettePage: CommandPalettePage;

    init: (monaco: typeof Monaco, editor: Monaco.editor.IStandaloneCodeEditor) => void;
    setTheme: (theme: Theme) => void;
    toggleCommandPalette: () => void;
    setZoom: (zoom?: number) => void;
    setFontSize: (fontSize?: number) => void;
    setEditorWidth: (editorWidth?: number) => void;
    setInterfaceComplexity: (complexity?: 'normal' | 'minimal') => void;
    setAutoSave: (period?: number) => void;
    setLineNumbers: (show?: boolean) => void;
    openInfo: () => void;
    openMarkdownReference: () => void;
    openShortcutReference: () => void;

    save: () => void;
    saveAs: () => void;
    open: () => void;
    openRecent: (path?: string) => void;
    newFile: () => void;
    confirmClose: () => Promise<boolean>;

    bold: () => void;
    italic: () => void;
    link: () => void;
    surroundText: (start: string, end: string) => void;

    onChange: () => void;
    updateDecorations: () => void;
    updateStats: () => void;
    onClose: () => void;

    fullscreen: boolean;
    toggleFullscreen: () => void;
};

const store = create<Store>((set, get) => ({
    settings: defaultSettings,

    path: '',
    saved: true,
    wordCount: 0,
    characterCount: 0,
    recentlyOpened: [],

    shortcuts: {
        'ctrl+shift+p': () => get().toggleCommandPalette(),
        'ctrl+p': () => get().toggleCommandPalette(),
        'esc': () => get().toggleCommandPalette(),
        'ctrl+s': () => get().save(),
        'ctrl+shift+s': () => get().saveAs(),
        'ctrl+o': () => get().open(),
        'ctrl+shift+o': () => get().openRecent(),
        'ctrl+n': () => get().newFile(),
        'ctrl+b': () => get().bold(),
        'ctrl+i': () => get().italic(),
        'ctrl+k': () => get().link()
    },
    commandPaletteOpen: false,
    commandPalettePage: 'general',

    init: async (monaco, editor) => {
        monaco.editor.defineTheme('light', createStyles(lightTheme));
        monaco.editor.defineTheme('dark', createStyles(darkTheme, true));
        monaco.editor.defineTheme('comma', createStyles(commaTheme));

        monaco.editor.addKeybindingRules([
            {
                // Disables Monaco's command palette
                keybinding: Monaco.KeyCode.F1,
                command: null
            }, {
                // Disables all of Monaco's keybindings starting with Ctrl+K
                keybinding: Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyK,
                command: null
            }, {
                // Disable trigger suggestion on Ctrl+I
                keybinding: Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyI,
                command: null
            }
        ]);

        monaco.languages.register({ id: 'custom-markdown' });
        monaco.languages.setLanguageConfiguration('custom-markdown', configuration);
        monaco.languages.setMonarchTokensProvider('custom-markdown', tokenProvider);

        // Disable command palette from the context menu
        const removableIds = ['editor.action.changeAll', 'editor.action.quickCommand'];
        // @ts-ignore
        const contextmenu = editor.getContribution('editor.contrib.contextmenu');
        // @ts-ignore
        const realMethod = contextmenu._getMenuActions;
        // @ts-ignore
        contextmenu._getMenuActions = function () {
            const items = realMethod.apply(contextmenu, arguments);
            // @ts-ignore
            return items.filter(function (item) {
                return !removableIds.includes(item.id);
            });
        };

        const settings = await window.electron.ipcRenderer.invoke('getSettings') as Settings;
        window.electron.webFrame.setZoomFactor(settings.zoom);
        document.getElementById('quote-border-container')!.style.setProperty('--accent', settings.theme.accent);

        editor.onDidContentSizeChange(() => {
            requestAnimationFrame(() => tagQuotes());
        });

        editor.onDidScrollChange(() => {
            requestAnimationFrame(() => tagQuotes());
        });

        const { firstTime, update } = await window.electron.ipcRenderer.invoke('getVersionInfo');
        if (firstTime) {
            editor.setValue(info);
        } else if (update) {
            // This piece of code should never be reached because there is no
            // previous version to update from... Once there is one, `info` will
            // be replaced by an update notice.
            editor.setValue(info);
        } else {
            const { path, content } = await window.electron.ipcRenderer.invoke('getLastFile');
            editor.setValue(content);
            set({ path });
        }

        // We need to enforce saved = true because changing the editor's value
        // triggered an onChange event that'll set saved to false
        set({ settings, monaco, editor, saved: true });

        if (settings.autoSave) autoSave(settings.autoSave, get().save, () => !get().saved);

        window.electron.ipcRenderer.invoke('checkForUpdates').then((update) => {
            if (!update) return;
            toast('A new version of Elementary is available. Click here to download it.', {
                onClick: () => window.open('https://bogosorter.github.io/elementary#download'),
                autoClose: false,
                theme: settings.theme.name === 'dark' ? 'dark' : 'light',
                position: 'bottom-right'
            });
        });
    },
    setTheme: async (theme) => {
        set({ settings: { ...get().settings, theme }, commandPaletteOpen: false });
        window.electron.ipcRenderer.send('setSettings', get().settings);
        document.getElementById('quote-border-container')!.style.setProperty('--accent', theme.accent);
    },
    toggleCommandPalette: () => {
        set({ commandPaletteOpen: !get().commandPaletteOpen, commandPalettePage: 'general' });
    },
    setZoom: (zoom) => {
        if (!zoom) {
            set({ commandPaletteOpen: true, commandPalettePage: 'zoom' });
            return;
        }

        window.electron.webFrame.setZoomFactor(zoom);
        set({ settings: { ...get().settings, zoom }, commandPaletteOpen: false, commandPalettePage: 'general' });
        window.electron.ipcRenderer.send('setSettings', get().settings);
    },
    setFontSize: (fontSize) => {
        if (!fontSize) {
            set({ commandPaletteOpen: true, commandPalettePage: 'fontSize' });
            return;
        }

        set({ settings: { ...get().settings, fontSize }, commandPaletteOpen: false, commandPalettePage: 'general' });
        window.electron.ipcRenderer.send('setSettings', get().settings);
    },
    setEditorWidth: (editorWidth) => {
        if (!editorWidth) {
            set({ commandPaletteOpen: true, commandPalettePage: 'editorWidth' });
            return;
        }

        set({ settings: { ...get().settings, editorWidth }, commandPaletteOpen: false });
        window.electron.ipcRenderer.send('setSettings', get().settings);
    },
    setInterfaceComplexity: (interfaceComplexity) => {
        if (!interfaceComplexity) {
            set({ commandPaletteOpen: true, commandPalettePage: 'interfaceComplexity' });
            return;
        }

        set({ settings: { ...get().settings, interfaceComplexity }, commandPaletteOpen: false });
        window.electron.ipcRenderer.send('setSettings', get().settings);
    },
    setAutoSave: (period) => {
        if (period === undefined) {
            set({ commandPaletteOpen: true, commandPalettePage: 'autoSave' });
            return;
        }

        set({ settings: { ...get().settings, autoSave: period }, commandPaletteOpen: false, commandPalettePage: 'general' });
        window.electron.ipcRenderer.send('setSettings', get().settings);

        cancelAutoSave();
        if (period) autoSave(period, get().save, () => !get().saved);
    },
    setLineNumbers: (show) => {
        if (show === undefined) {
            set({ commandPaletteOpen: true, commandPalettePage: 'lineNumbers' });
            return;
        }

        set({ settings: { ...get().settings, showLineNumbers: show }, commandPaletteOpen: false, commandPalettePage: 'general' });
        window.electron.ipcRenderer.send('setSettings', get().settings);
    },
    openInfo: async () => {
        if (!await get().confirmClose()) return;

        get().editor!.setValue(info);
        set({ path: '', saved: true, commandPaletteOpen: false });
    },
    openMarkdownReference: async () => {
        if (!await get().confirmClose()) return;

        get().editor!.setValue(markdown);
        set({ path: '', saved: true, commandPaletteOpen: false });
    },
    openShortcutReference: async () => {
        if (!await get().confirmClose()) return;

        get().editor!.setValue(shortcuts);
        set({ path: '', saved: true, commandPaletteOpen: false });
    },

    save: async () => {
        if (get().saved) return;

        const path = await window.electron.ipcRenderer.invoke('save', get().path, get().editor!.getValue());
        if (!path) return;
        set({ path, saved: true, commandPaletteOpen: false });
    },

    saveAs: async () => {
        const path = await window.electron.ipcRenderer.invoke('saveAs', get().editor!.getValue());
        if (!path) return;
        set({ path, saved: true, commandPaletteOpen: false });
    },

    open: async () => {
        if (!await get().confirmClose()) return;

        const file = await window.electron.ipcRenderer.invoke('open');
        if (!file) return;

        get().editor!.setValue(file.content);
        set({ path: file.path, saved: true, commandPaletteOpen: false });
    },

    openRecent: async (path) => {
        if (!path) {
            const recentlyOpened = await window.electron.ipcRenderer.invoke('getRecent');
            set({ commandPaletteOpen: true, commandPalettePage: 'recentlyOpened', recentlyOpened });
            return;
        }

        if (!await get().confirmClose()) return;

        const content = await window.electron.ipcRenderer.invoke('loadFile', path);
        if (!content) return;

        get().editor!.setValue(content);
        set({ path: path, saved: true, commandPaletteOpen: false, commandPalettePage: 'general' });
    },

    newFile: async () => {
        if (!await get().confirmClose()) return;

        get().editor!.setValue('Hello world!');
        set({ path: '', saved: true, commandPaletteOpen: false });
    },

    confirmClose: async () => {
        if (!get().saved) {
            // 0 if cancelled
            // 1 if the current file shouldn't be saved
            // 2 if the current file should be saved
            const save = await window.electron.ipcRenderer.invoke('showSaveDialog');

            if (save == 0) return false;
            if (save == 2) get().save();
        }

        return true;
    },

    bold: () => {
        get().surroundText('**', '**');
    },
    italic: () => {
        get().surroundText('*', '*');
    },
    link: () => {
        get().surroundText('[', '](url)');
    },
    surroundText: (start: string, end: string) => {
        let selection = get().editor!.getSelection();
        if (!selection) return;
        // If the selection spans multiple lines, the user commited an error
        if (selection.startLineNumber !== selection.endLineNumber) return;

        // If the selection is empty but near a word, select the word
        if (selection.startColumn === selection.endColumn) {
            const word = get().editor!.getModel()!.getWordAtPosition(selection.getStartPosition());
            if (word) {
                selection = new Monaco.Selection(
                    selection.startLineNumber,
                    word.startColumn,
                    selection.endLineNumber,
                    word.endColumn
                );
            }
        }

        const source = get().editor!.getModel()!.getValueInRange(selection);
        const result = start + source + end;

        get().editor!.executeEdits('', [{
            range: selection,
            text: result,
            forceMoveMarkers: true
        }]);

        // If the selection was empty, the cursor should be placed between the start and end
        if (selection.startColumn === selection.endColumn) {
            const newSelection = new Monaco.Selection(
                selection.startLineNumber,
                selection.startColumn + start.length,
                selection.endLineNumber,
                selection.startColumn + start.length
            );
            get().editor!.setSelection(newSelection);
        } else {
            const newSelection = new Monaco.Selection(
                selection.startLineNumber,
                selection.startColumn,
                selection.endLineNumber,
                selection.endColumn + start.length + end.length
            );
            get().editor!.setSelection(newSelection);
        }
    },

    onChange: () => {
        set({ saved: false });

        // Ideally, we would call updateDecorations() here for addQuoteData to
        // work, but on the first run the editor isn't ready yet. So, on the
        // first time, we'll call it using requestAnimationFrame, since the
        // editor will be ready by then.
        if (!get().monaco || !get().editor) requestAnimationFrame(() => {
            get().updateDecorations()
            get().updateStats();
        });
        else {
            get().updateDecorations()
            get().updateStats();
        }

        requestAnimationFrame(() => tagQuotes());

        /*
        Left here for future reference

        get().monaco?.editor.setModelMarkers(get().editor!.getModel()!, 'markdown', [{
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
            message: 'Unsaved changes',
            severity: 2
        }])
        */
    },
    updateDecorations: () => {
        const decorations: Monaco.editor.IModelDeltaDecoration[] = [];
        const tokens = get().monaco!.editor.tokenize(get().editor!.getValue(), 'custom-markdown');

        for (let line = 0; line < tokens.length; line++) {
            for (let j = 0; j < tokens[line].length; j++) {
                const token = tokens[line][j];
                const lineLength = get().editor!.getModel()!.getLineContent(line + 1).length;

                if (token.type === 'strikethrough.md' || token.type == 'highlight.md') {
                    const startColumn = token.offset + 1;
                    const endColumn = j == tokens[line].length - 1 ? lineLength + 1 : tokens[line][j + 1].offset + 1;

                    decorations.push({
                        range: new Monaco.Range(line + 1, startColumn, line + 1, endColumn),
                        options: {
                            inlineClassName: token.type.substring(0, token.type.length - 3)
                        }
                    });

                } else if (token.type === 'quote.md') {
                    decorations.push({
                        range: new Monaco.Range(line + 1, 1, line + 1, lineLength + 1),
                        options: {
                            inlineClassName: 'quote'
                        }
                    });
                }
            }
        }

        // This method is deprecated but the new one
        // (createDecorationsCollection) doesn't seem to work...
        oldDecorations = get().editor!.deltaDecorations(oldDecorations, decorations);
    },
    updateStats: () => {
        const text = get().editor!.getValue();
        const characterCount = text.length;
        const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
        set({ characterCount, wordCount });
    },
    onClose: async () => {
        if (!await get().confirmClose()) return;
        window.electron.ipcRenderer.send('window', 'close');
    },

    fullscreen: false,
    toggleFullscreen: () => {
        set({ fullscreen: !get().fullscreen });
    }
}));

let oldDecorations: string[] = [];

window.electron.ipcRenderer.on('toggleFullscreen', () => {
    store.getState().toggleFullscreen();
});

window.electron.ipcRenderer.on('close', () => {
    store.getState().onClose();
});

export default store;
