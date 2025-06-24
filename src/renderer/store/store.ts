import { create } from 'zustand';
import * as Monaco from 'monaco-editor';
import { toast } from 'react-toastify';
import { lightTheme, darkTheme, commaTheme, createStyles } from '../../themes';
import defaultSettings, { Settings } from '../../settings';
import { configuration, tokenProvider } from '../utils/tokenProvider';
import { autoSave, cancelAutoSave } from '../utils/autosave';
import { info, markdown, shortcuts, changelog, pdfExportGuide } from '../texts/texts';
import 'react-toastify/dist/ReactToastify.css';
import tagQuotes from '../utils/quotes';

type CommandPalettePage = 'general' | 'recentlyOpened' | keyof Settings;

type Store = {
    // General app state and settings
    settings: Settings;
    recentlyOpened: string[];
    shortcuts: { [key: string]: () => void };
    commandPalette: {
        open: boolean;
        page: CommandPalettePage;
    }
    fullscreen: boolean;

    // Editor state
    path: string;
    content: string;
    saved: boolean;
    wordCount: number;
    characterCount: number;
    preview: boolean;

    // Monaco editor references
    monaco?: typeof Monaco;
    editor?: Monaco.editor.IStandaloneCodeEditor;
    currentSelection: Monaco.Selection | null;
    currentScroll: number | null;
    initializeEditor: (monaco: typeof Monaco, editor: Monaco.editor.IStandaloneCodeEditor) => void;

    // App state methods
    init: () => Promise<void>;
    openCommandPalette: (page?: CommandPalettePage) => void;
    closeCommandPalette: () => void;
    toggleCommandPalette: () => void;
    toggleFullscreen: () => void;
    togglePreview: () => void;
    // Checks if the current file is saved and prompts the user to save it
    canCloseFile: () => Promise<boolean>;

    // Settings methods
    changeSetting: (setting: keyof Settings, value?: any) => void;
    resetSettings: () => void;
    applySettings: () => void;

    // File operations
    save: () => Promise<void>;
    saveAs: () => Promise<void>;
    open: () => Promise<void>;
    openRecent: (path?: string) => Promise<void>;
    newFile: () => Promise<void>;
    exportToPDF: () => Promise<void>;

    // Inline markdown elements
    bold: () => void;
    italic: () => void;
    strikethrough: () => void;
    inlineCode: () => void;
    highlight: () => void;
    link: () => void;

    // Block-level markdown elements
    heading: () => void;
    quote: () => void;
    orderedList: () => void;
    unorderedList: () => void;
    todoList: () => void;

    // Other text editing operations
    uppercase: () => void;
    lowercase: () => void;
    duplicateLines: () => void;

    // Auxiliar text methods
    surroundText: (start: string, end: string) => void;
    transformText: (transformation: (input: string) => string) => void;
    prependText: (start: string) => void;

    // Documentation
    openInfo: () => Promise<void>;
    openUpdateNotice: () => Promise<void>;
    openMarkdownReference: () => Promise<void>;
    openShortcutReference: () => Promise<void>;
    openPDFExportGuide: () => Promise<void>;


    // Misc methods
    onChange: () => void;
    onWindowClose: () => Promise<void>;
    getLocalFile: (path: string) => Promise<string | null>;
    getLocalFileBase64: (path: string) => Promise<{mimeType: string, data: string} | null>;
    getSelectedText: () => Monaco.Selection | null;
    // Ensures that some custom markdown elements are rendered correctly
    updateDecorations: () => void;
    updateStats: () => void;
};

const store = create<Store>((set, get) => ({
    settings: defaultSettings,
    recentlyOpened: [],
    shortcuts: {
        'ctrl+shift+p': () => get().toggleCommandPalette(),
        'ctrl+p': () => get().toggleCommandPalette(),
        'esc': () => get().closeCommandPalette(),
        'ctrl+e': () => get().togglePreview(),
        'ctrl+s': () => get().save(),
        'ctrl+shift+s': () => get().saveAs(),
        'ctrl+o': () => get().open(),
        'ctrl+shift+o': () => get().openRecent(),
        'ctrl+n': () => get().newFile(),
        'ctrl+b': () => get().bold(),
        'ctrl+i': () => get().italic(),
        'ctrl+k': () => get().link(),
        'ctrl+u': () => get().uppercase(),
        'ctrl+l': () => get().lowercase(),
        'ctrl+d': () => get().duplicateLines()
    },
    commandPalette: {
        open: false,
        page: 'general' as const,
    },
    fullscreen: false,

    path: '',
    content: '',
    saved: true,
    wordCount: 0,
    characterCount: 0,
    preview: false,

    monaco: undefined,
    editor: undefined,
    currentSelection: null,
    currentScroll: null,
    initializeEditor: (monaco, editor) => {
        set({ monaco, editor });

        monaco.editor.defineTheme('light', createStyles(lightTheme));
        monaco.editor.defineTheme('dark', createStyles(darkTheme, true));
        monaco.editor.defineTheme('comma', createStyles(commaTheme));

        // Disable monaco keybindings
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
            }, {
                // Disable Ctrl+U keybindings
                keybinding: Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyU,
                command: null
            }, {
                keybinding: Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyL
            }, {
                // Disable Ctrl+D keybindings
                keybinding: Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyD,
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

        editor.onDidContentSizeChange(() => {
            requestAnimationFrame(() => tagQuotes());
        });

        editor.onDidScrollChange(() => {
            requestAnimationFrame(() => tagQuotes());
        });

        editor.setValue(get().content);
        if (get().currentSelection) {
            editor.setSelection(get().currentSelection!);
            // This has to be delayed, probably because the editor isn't able to
            // calculate its height yet
            setTimeout(() => {
                editor.revealRangeInCenter(get().currentSelection!, Monaco.editor.ScrollType.Immediate);
            }, 1);
        }
        monaco.editor.setTheme(get().settings.theme.name);
        editor.focus();
        get().onChange();

        // We need to enforce save = true here because the previous line sets
        // save = false and we don't want that to happen when the editor is
        // initialized
        set({ saved: true });
    },

    init: async () => {
        const settings = await window.electron.ipcRenderer.invoke('getSettings') as Settings;
        set({ settings });
        get().applySettings();

        const { firstTime, update } = await window.electron.ipcRenderer.invoke('getVersionInfo');
        let path = '';
        let content = '';
        if (firstTime) content = info;
        else if (update) content = changelog;
        else {
            const file = await window.electron.ipcRenderer.invoke('getLastFile');
            path = file.path;
            content = file.content;
        }

        if (get().editor) get().editor!.setValue(content);
        set({ path, content, saved: true });



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
    openCommandPalette: (page) => {
        set({ commandPalette: { open: true, page: page || 'general' } });
    },
    closeCommandPalette: () => {
        set({ commandPalette: { open: false, page: 'general' } });
    },
    toggleCommandPalette: () => {
        set({ commandPalette: { open: !get().commandPalette.open, page: 'general' } });
    },
    toggleFullscreen: () => {
        set({ fullscreen: !get().fullscreen });
    },
    togglePreview: () => {
        if (!get().preview) {
            // Save the current selection to restore it later
            set({ currentSelection: get().editor!.getSelection() });
            // Remove quotes
            requestAnimationFrame(() => {
                tagQuotes();
                if (get().currentScroll) document.getElementById('preview')!.scrollTo({
                    top: get().currentScroll!,
                    behavior: 'instant'
                });
            });
        } else set({ currentScroll: document.getElementById('preview')!.scrollTop });

        set({ preview: !get().preview });
        get().closeCommandPalette();
    },
    canCloseFile: async () => {
        if (!get().saved) {
            // 0 if cancelled
            // 1 if the current file shouldn't be saved
            // 2 if the current file should be saved
            const save = await window.electron.ipcRenderer.invoke('showSaveDialog');

            if (save == 0) return false;
            if (save == 2) get().save();
        }

        // The file is saved or the user chose not to save it

        // Reset selection
        set({ currentSelection: null, currentScroll: null });
        return true;
    },

    changeSetting: (setting, value) => {
        if (value === undefined) get().openCommandPalette(setting);
        else {
            get().closeCommandPalette();
            set({ settings: { ...get().settings, [setting]: value } });
            window.electron.ipcRenderer.send('setSettings', get().settings);
            get().applySettings();
        }
    },
    resetSettings: () => {
        set({ settings: defaultSettings });
        window.electron.ipcRenderer.send('setSettings', defaultSettings);
        get().applySettings();
        get().closeCommandPalette();
    },
    applySettings: () => {
        const settings = get().settings;
        window.electron.webFrame.setZoomFactor(settings.zoom);
        document.getElementById('quote-border-container')!.style.setProperty('--accent', settings.theme.accent);
        cancelAutoSave();
        if (settings.autoSave) autoSave(settings.autoSave, get().save, () => !get().saved && get().path !== '');
    },

    save: async () => {
        get().closeCommandPalette();
        if (get().saved) return;

        if (!get().path) {
            get().saveAs();
            return;
        }

        await window.electron.ipcRenderer.invoke('save', get().path, get().content);
        set({ saved: true });

    },
    saveAs: async () => {
        get().closeCommandPalette();

        const path = await window.electron.ipcRenderer.invoke('saveAs', get().content);
        if (!path) return;

        set({ path, saved: true });
    },
    open: async () => {
        get().closeCommandPalette();

        if (!await get().canCloseFile()) return;

        const file = await window.electron.ipcRenderer.invoke('open');
        if (!file) return;

        get().editor?.setValue(file.content);
        get().editor?.setScrollTop(0);
        set({ path: file.path, content: file.content, saved: true });
    },
    openRecent: async (path) => {
        if (!path) {
            const recentlyOpened = await window.electron.ipcRenderer.invoke('getRecent');
            set({ recentlyOpened });
            get().openCommandPalette('recentlyOpened');
            return;
        }

        get().closeCommandPalette();

        if (!await get().canCloseFile()) return;

        const content = await window.electron.ipcRenderer.invoke('loadFile', path);
        if (!content) {
            toast('An error occurred. Please check if the file exists.', {
                autoClose: false,
                theme: get().settings.theme.name === 'dark'? 'dark' : 'light',
                position: 'bottom-right'
            });
            return;
        }

        get().editor?.setValue(content);
        get().editor?.setScrollTop(0);
        set({ path: path, content: content, saved: true });
    },
    newFile: async () => {
        if (!await get().canCloseFile()) return;

        set({ path: '', content: 'hello, world', saved: true });
        if (get().preview) get().togglePreview();
        else get().editor!.setValue('hello, world');

        get().closeCommandPalette();
    },
    exportToPDF: async () => {
        get().closeCommandPalette();

        if (!get().saved || get().path === '') {
            toast('Please save your file before exporting it.', {
                autoClose: false,
                theme: get().settings.theme.name === 'dark'? 'dark' : 'light',
                position: 'bottom-right'
            });
            return;
        }

        const result = await window.electron.ipcRenderer.invoke('exportToPDF', get().path);

        // User cancelled the export
        if (result == 'canceled') return;
        // An error occurred
        if (result == 'error') toast('Couldn\t export document: an error occurred. Please check the export guide.', {
            autoClose: false,
            theme: get().settings.theme.name === 'dark'? 'dark' : 'light',
            position: 'bottom-right'
        });
        else toast(`File exported to ${result}`, {
            autoClose: false,
            theme: get().settings.theme.name === 'dark'? 'dark' : 'light',
            position: 'bottom-right',
            onClick: () => {
                window.electron.ipcRenderer.send('showInFolder', result);
            }
        });
    },

    bold: () => {
        get().surroundText('**', '**');
        get().closeCommandPalette();
    },
    italic: () => {
        get().surroundText('*', '*');
        get().closeCommandPalette();
    },
    strikethrough: () => {
        get().surroundText('~~', '~~');
        get().closeCommandPalette();
    },
    inlineCode: () => {
        get().surroundText('`', '`');
        get().closeCommandPalette();
    },
    highlight: () => {
        get().surroundText('==', '==');
        get().closeCommandPalette();
    },
    link: () => {
        get().surroundText('[', '](url)');
        get().closeCommandPalette();
    },

    heading: () => {
        if (!get().editor) return;

        const selection = get().editor!.getSelection();
        if (!selection) return;

        for (let line = selection.startLineNumber; line <= selection.endLineNumber; line++) {
            // Check if line already is a heading
            const beginning = new Monaco.Range(line, 1, line, 2);
            const isHeading = get().editor!.getModel()!.getValueInRange(beginning) === '#';

            get().editor!.executeEdits('', [{
                range: new Monaco.Range(line, 0, line, 0),
                // If the line is not a heading yet, add a space after the hash
                text: isHeading ? '#' : '# ',
                forceMoveMarkers: true
            }]);
        }

        get().editor!.focus();
        get().closeCommandPalette();
    },
    quote: () => {
        get().prependText('> ');
        get().closeCommandPalette();
    },
    orderedList: () => {
        if (!get().editor) return;

        const selection = get().editor!.getSelection();
        if (!selection) return;

        let itemNumber = 0;
        if (selection.startLineNumber !== 1) {
            // Try to read an item number from the previous line
            const previousLine = get().editor!.getModel()!.getLineContent(selection.startLineNumber - 1);
            try {
                itemNumber = Number(previousLine.split('.')[0]);
            } catch (e) { }
        }

        for (let line = selection.startLineNumber; line <= selection.endLineNumber; line++) {
            itemNumber++;
            get().editor!.executeEdits('', [{
                range: new Monaco.Range(line, 0, line, 0),
                text: `${itemNumber}. `,
                forceMoveMarkers: true
            }]);
        }

        get().editor!.focus();
        get().closeCommandPalette();
    },
    unorderedList: () => {
        get().prependText('- ')
        get().closeCommandPalette();
    },
    todoList: () => {
        get().prependText('- [ ] ');
        get().closeCommandPalette();
    },

    uppercase: () => {
        get().transformText((input) => input.toUpperCase());
        get().closeCommandPalette();
    },
    lowercase: () => {
        get().transformText((input) => input.toLowerCase());
        get().closeCommandPalette();
    },
    duplicateLines: () => {
        get().closeCommandPalette();

        if (!(get().editor && get().monaco)) return;

        let selection = get().editor!.getSelection();
        if (!selection) return;

        selection = new Monaco.Selection(
            selection.startLineNumber,
            0,
            selection.endLineNumber,
            get().editor!.getModel()!.getLineContent(selection.endLineNumber).length + 1
        );

        const lines = get().editor!.getModel()!.getValueInRange(selection);
        console.log(lines);
        get().editor!.executeEdits('', [{
            range: selection,
            // A double newline is needed since the newline character is not returned by
            // `getValueInRange` and markdown paragraphs are separated by an extra newline.
            text: lines + '\n\n' + lines,
            forceMoveMarkers: true
        }]);
    },

    surroundText: (start, end) => {
        if (!get().editor) return;

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

        get().editor!.focus();
    },
    transformText: (transformation) => {
        const selection = get().getSelectedText();
        if (!selection) return;

        const source = get().editor!.getModel()!.getValueInRange(selection);
        const result = transformation(source);

        get().editor!.executeEdits('', [{
            range: selection,
            text: result,
            forceMoveMarkers: true
        }]);

        // TODO: Is this necessary?
        get().editor!.setSelection(selection);
        get().editor!.focus();
    },
    prependText: (start) => {
        if (!get().editor) return;

        const selection = get().editor!.getSelection();
        if (!selection) return;

        for (let line = selection.startLineNumber; line <= selection.endLineNumber; line++) {
            get().editor!.executeEdits('', [{
                range: new Monaco.Range(line, 0, line, 0),
                text: start,
                forceMoveMarkers: true
            }]);
        }

        get().editor!.focus();
    },

    openInfo: async () => {
        get().closeCommandPalette();
        if (!await get().canCloseFile()) return;

        get().editor?.setValue(info);
        set({ path: '', content: info, saved: true });
    },
    openUpdateNotice: async () => {
        if (!await get().canCloseFile()) return;

        get().editor?.setValue(changelog);
        set({ path: '', content: changelog, saved: true });
        get().closeCommandPalette();
    },
    openMarkdownReference: async () => {
        get().closeCommandPalette();
        if (!await get().canCloseFile()) return;

        get().editor?.setValue(markdown);
        set({ path: '', content: markdown, saved: true });
    },
    openShortcutReference: async () => {
        get().closeCommandPalette();
        if (!await get().canCloseFile()) return;

        get().editor?.setValue(shortcuts);
        set({ path: '', content: shortcuts, saved: true });
    },
    openPDFExportGuide: async() => {
        get().closeCommandPalette();
        if (!await get().canCloseFile()) return;

        get().editor?.setValue(pdfExportGuide);
        set({ path: '', content: pdfExportGuide, saved: true });
    },

    onChange: () => {
        if (!get().editor) return;

        set({ saved: false, content: get().editor!.getValue() });

        get().updateDecorations()
        get().updateStats()
        requestAnimationFrame(() => tagQuotes());
    },
    onWindowClose: async () => {
        if (!await get().canCloseFile()) return;
        window.electron.ipcRenderer.send('window', 'close');
    },
    getLocalFile: async (path) => {
        if (!get().path) return null;
        return await window.electron.ipcRenderer.invoke('getLocalFile', get().path, path);
    },
    getLocalFileBase64: async (path) => {
        if (!get().path) return null;
        return await window.electron.ipcRenderer.invoke('getLocalFileBase64', get().path, path);
    },
    getSelectedText: () => {
        if (!get().editor) return null;

        let selection = get().editor!.getSelection();
        if (!selection) return null;

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

        return selection;
    },
    updateDecorations: () => {
        if (!get().monaco || !get().editor) return;

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
        if (!get().editor) return;

        const text = get().editor!.getValue();
        const characterCount = text.length;
        const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
        set({ characterCount, wordCount });
    },
}));

store.getState().init();

let oldDecorations: string[] = [];

window.electron.ipcRenderer.on('toggleFullscreen', () => {
    store.getState().toggleFullscreen();
});

window.electron.ipcRenderer.on('close', () => {
    store.getState().onWindowClose();
});

export default store;
