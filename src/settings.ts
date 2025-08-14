import { Theme, lightTheme } from './themes';

export type Settings = {
    theme: Theme;
    fontSize: number;
    zoom: number;
    editorWidth: number;
    interfaceComplexity: 'normal' | 'minimal';
    autoSave: number;
    showLineNumbers: boolean;
    sidebar: 'hidden' | 'fileActions' | 'markdownActions' | 'all';
    highlightCurrentLine: boolean;
    previewTextAlign: 'left' | 'center' | 'right' | 'justify';
    cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
    smoothCursor: boolean;
    automaticExportFilename: boolean;
    prereleaseNotification: boolean;
    dictionary: string | null;
}

const defaultSettings: Settings = {
    theme: lightTheme,
    fontSize: 18,
    zoom: 1,
    editorWidth: 1000,
    interfaceComplexity: 'normal',
    autoSave: 0,
    showLineNumbers: false,
    sidebar: 'all',
    highlightCurrentLine: false,
    previewTextAlign: 'justify',
    cursorBlinking: 'phase',
    smoothCursor: true,
    automaticExportFilename: false,
    prereleaseNotification: false,
    dictionary: 'en_US'
};

export default defaultSettings;
