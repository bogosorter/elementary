import { CSSProperties, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { Editor, loader } from '@monaco-editor/react';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import CommandPalette from './components/CommandPalette';
import store from './store/store';
import handleShortcut from './utils/shortcuts';
import ControlButtons from './components/ControlButtons';
import addQuoteClasses from './utils/quotes';

import { Theme } from '../themes';

import './App.css';

loader.config({ monaco });

function App() {

    const theme = store((state) => state.settings.theme);
    const fontSize = store((state) => state.settings.fontSize);
    const editorWidth = store((state) => state.settings.editorWidth);
    const shortcuts = store((state) => state.shortcuts);
    const showButtons = store(state => state.settings.interfaceComplexity) == 'normal';

    useEffect(() => {
        const quoteClassName = theme.name === 'dark'? ['mtk23', 'mtk24'] : ['mtk24', 'mtk25'];
        requestAnimationFrame(() => addQuoteClasses(quoteClassName));
    }, [theme]);

    return (
        <div
            id='app'
            style={createAppVariables(theme, editorWidth)}
            onKeyDown={(e) => handleShortcut(e, shortcuts)}
            tabIndex={-1}
        >
            <CommandPalette />
            <Header />
            <div id='container'>
                <Editor
                    defaultLanguage="custom-markdown"
                    defaultValue='Hello world!'
                    width="100%"
                    options={createEditorOptions(theme, fontSize)}
                    onMount={(editor, monaco) => {
                        store.getState().init(monaco, editor);
                    }}
                    onChange={() => store.getState().onChange()}
                />
            </div>
            {showButtons && <ControlButtons />}
            <ToastContainer />
        </div>
    );
}

function createAppVariables(theme: Theme, editorWidth: number): CSSProperties {
    return {
        backgroundColor: theme.surface,
        color: theme.primary,
        '--mtk23': theme.accent,
        '--mtk24': theme.name == 'dark'? theme.primary : theme.accent,
        '--mtk25': theme.primary,
        '--accent': theme.accent,
        '--editor-width': `${editorWidth}px`,
        '--toastify-color-light': theme.surfaceVariant,
        '--toastify-text-color-light': theme.primary
    } as CSSProperties;
}

function createEditorOptions(theme: Theme, fontSize: number): monaco.editor.IStandaloneEditorConstructionOptions {
    return {
        lineNumbers: "off",
        cursorBlinking: "phase",
        cursorSmoothCaretAnimation: "on",
        minimap: {
            enabled: false,
        },
        smoothScrolling: true,
        wordBasedSuggestions: "off",
        wordWrap: "on",
        renderLineHighlight: "none",
        theme: theme.name,
        fontSize,
        padding: {
            top: 50,
            bottom: 30
        },
        selectionHighlight: false,
        matchBrackets: "never",
        folding: false,
        occurrencesHighlight: "off",
        bracketPairColorization: {
            enabled: false
        },
        unicodeHighlight: {
            ambiguousCharacters: false,
            invisibleCharacters: false,
        },
        guides: {
            indentation: false
        },
        lineDecorationsWidth: 50,
        stickyScroll: {
            enabled: false
        }
    };
}

export default App;
