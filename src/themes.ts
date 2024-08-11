import { editor } from 'monaco-editor';

export type Theme = {
    name: string;

    // Main theme colors
    surface: string;
    surfaceVariant: string;
    primary: string;
    primaryMuted: string;
    secondary: string;
    secondaryMuted: string;
    accent: string;

    // Auxiliary colors
    strong: string;
    selection: string;
}

const lightTheme: Theme = {
    name: 'light',
    surface: '#ebebeb',
    surfaceVariant: '#fafafa',
    primary: '#3c3c3c',
    primaryMuted: '#7c7c7c',
    secondary: '#995bc0',
    secondaryMuted: '#a986bf',
    accent: '#286c93',
    strong: '#303030',
    selection: '#d5d5d5'
};

const darkTheme: Theme = {
    name: 'dark',
    surface: '#3c3c3c',
    surfaceVariant: '#323232',
    primary: '#ebebeb',
    primaryMuted: '#828282',
    secondary: '#a57ebd',
    secondaryMuted: '#af95bf',
    accent: '#408fbd',
    strong: '#fbfbfb',
    selection: '#5c5c5c'
};

const commaTheme: Theme = {
    name: 'comma',
    surface: '#e3caca',
    surfaceVariant: '#d5afaf',
    primary: '#2c2E58',
    primaryMuted: '#2c2E5840',
    accent: '#a94c69',
    secondary: '#5f3878',
    secondaryMuted: '#9f69c2',
    strong: '#3e5e65',
    selection: '#af9fa5'
};

function createStyles(colors: Theme, dark: boolean = false): editor.IStandaloneThemeData {
    return {
        base: dark? 'vs-dark' : 'vs',
        colors: {
            // For reference see https://github.com/microsoft/monaco-editor/issues/1631#issuecomment-555912216,
            'foreground': colors.primary,
            'editor.background': colors.surface,
            'editor.foreground': colors.primary,
            'editor.selectionBackground': colors.selection,
            'editor.selectionForeground': colors.primary,
            'editor.inactiveSelectionBackground': colors.selection,
            'editor.findMatchBackground': colors.accent + '80',
            'editor.findMatchHighlightBackground': colors.accent + '40',
            'editor.rangeHighlightBackground': colors.surfaceVariant + '80',
            'editorCursor.foreground': colors.accent,
            'editorWidget.background': colors.surface,
            'editorWidget.border': colors.surface,
            'editorWhitespace.foreground': colors.primary + '80',
            'editorBracketHighlight.foreground1': colors.primary,
            'editorBracketHighlight.foreground2': colors.primary,
            'editorBracketHighlight.foreground3': colors.primary,
            'editorBracketHighlight.foreground4': colors.primary,
            'editorBracketHighlight.foreground5': colors.primary,
            'editorBracketHighlight.foreground6': colors.primary,
            'input.background': colors.surface,
            'input.foreground': colors.primary,
            'input.border': colors.primary + '40',
            'focusBorder': colors.primary + '80',
            'input.placeholderForeground': colors.primary + 'D0',
            'dropdown.background': colors.surface,
            'dropdown.foreground': colors.primary,
            'dropdown.border': colors.surfaceVariant,
            'textSeparator.foreground': colors.primary,
            'list.focusBackground': colors.surfaceVariant,
            'list.focusForeground': colors.primary,
            'list.activeSelectionBackground': colors.surfaceVariant,
            'list.activeSelectionForeground': colors.primary,
            'list.inactiveSelectionBackground': colors.surfaceVariant,
            'list.inactiveSelectionForeground': colors.primary,
            'list.hoverBackground': colors.surfaceVariant,
            'list.hoverForeground': colors.primary,
            'button.background': colors.surface,
            'button.hoverBackground': colors.surfaceVariant,
            'button.foreground': colors.primary,
            'editorLink.activeForeground': colors.accent,
            'editorSuggestWidget.background': colors.surfaceVariant,
            'editorSuggestWidget.foreground': colors.primary,
            'editorSuggestWidget.selectBackground': colors.accent,
            'editorSuggestWidget.highlightForeground': colors.accent,
            'editorLineNumber.foreground': colors.primaryMuted,
            'editorLineNumber.activeForeground': colors.primaryMuted,
            'scrollbarSlider.background': colors.primaryMuted,
            'scrollbarSlider.hoverBackground': colors.primaryMuted,
            'scrollbarSlider.activeBackground': colors.primaryMuted,
        },
        encodedTokensColors: [],
        inherit: true,
        rules: [
            {
                token: '',
                foreground: colors.primary
            }, {
                token: 'heading1',
                foreground: colors.accent,
                fontStyle: 'bold'
            }, {
                token: 'heading2',
                foreground: colors.accent,
                fontStyle: 'bold'
            }, {
                token: 'heading3',
                foreground: colors.accent,
                fontStyle: 'bold'
            }, {
                token: 'heading4',
                foreground: colors.accent,
                fontStyle: 'bold'
            }, {
                token: 'heading5',
                foreground: colors.accent,
                fontStyle: 'bold'
            }, {
                token: 'heading6',
                foreground: colors.accent,
                fontStyle: 'bold'
            }, {
                token: 'quote',
                foreground: colors.accent
            }, {
                token: 'list',
                foreground: colors.accent,
                fontStyle: 'bold'
            }, {
                token: 'code',
                foreground: colors.accent
            }, {
                token: 'string.link',
                foreground: colors.accent
            }, {
                token: 'inline-code',
                foreground: colors.accent
            }, {
                token: 'keyword',
                foreground: colors.secondary
            }, {
                token: 'comment',
                foreground: colors.primaryMuted
            }, {
                token: 'string',
                foreground: colors.accent
            }, {
                token: 'number',
                foreground: colors.accent
            }, {
                token: 'variable',
                foreground: colors.accent
            }, {
                token: 'constant',
                foreground: colors.accent
            }, {
                token: 'function',
                foreground: colors.accent
            }, {
                token: 'class',
                foreground: colors.secondary,
            }, {
                token: 'type',
                foreground: colors.primary
            }, {
                token: 'operator',
                foreground: colors.primary
            }, {
                token: 'punctuation',
                foreground: colors.primary
            }, {
                token: 'attribute',
                foreground: colors.secondary
            }, {
                token: 'tag',
                foreground: colors.secondary
            }, {
                token: 'storage',
                foreground: colors.accent
            }
        ]
    };
}

export { lightTheme, darkTheme, commaTheme, createStyles };
