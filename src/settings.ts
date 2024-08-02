import { Theme, lightTheme } from './themes';

export type Settings = {
    theme: Theme;
    fontSize: number;
    zoom: number;
    editorWidth: number;
    interfaceComplexity: 'normal' | 'minimal';
    autoSave: number;
}

const defaultSettings: Settings = {
    theme: lightTheme,
    fontSize: 18,
    zoom: 1,
    editorWidth: 1000,
    interfaceComplexity: 'normal',
    autoSave: 0
};

export default defaultSettings;
