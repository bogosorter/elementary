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
    automaticExportFilename: boolean;
    prereleaseNotification: boolean;
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
    automaticExportFilename: false,
    prereleaseNotification: false
};

export default defaultSettings;
