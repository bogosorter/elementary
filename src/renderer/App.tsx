import { CSSProperties, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { Editor, loader } from '@monaco-editor/react';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Footer from './components/Footer';
import Preview from './components/Preview';
import CommandPalette from './components/CommandPalette';
import Sidebar from './components/Sidebar';
import store from './store/store';
import handleShortcut from './utils/shortcuts';
import tagQuotes from './utils/quotes';

import { Theme } from '../themes';

import './App.css';
import { Settings } from '../settings';

loader.config({ monaco });

function App() {
    const settings = store((state) => state.settings);
    const shortcuts = store((state) => state.shortcuts);
    const preview = store(state => state.preview);

    useEffect(() => {
        requestAnimationFrame(() => tagQuotes());
    }, [settings.theme]);

    return (
        <div
            id='app'
            style={createAppVariables(settings.theme, settings.editorWidth)}
            onKeyDown={(e) => handleShortcut(e, shortcuts)}
            tabIndex={-1}
        >
            <CommandPalette />
            <Header />
            {!preview &&
                <div id='container'>
                    <Editor
                        defaultLanguage='custom-markdown'
                        defaultValue='Hello world!'
                        width='100%'
                        options={createEditorOptions(settings)}
                        onMount={(editor, monaco) => {
                            store.getState().initializeEditor(monaco, editor);
                        }}
                        onChange={() => store.getState().onChange()}
                    />
                </div>
            }
            {preview && <Preview />}
            <Footer />
            {settings.interfaceComplexity === 'normal' && <Sidebar />}
            <ToastContainer />
        </div>
    );
}

function createAppVariables(theme: Theme, editorWidth: number): CSSProperties {
    return {
        backgroundColor: theme.surface,
        color: theme.primary,
        '--surface': theme.surface,
        '--accent': theme.accent,
        '--primary-muted': theme.primaryMuted,
        '--editor-width': `${editorWidth}px`,
        '--toastify-color-light': theme.surfaceVariant,
        '--toastify-text-color-light': theme.primary,
        '--highlight-color': theme.accent + '60'
    } as CSSProperties;
}

function createEditorOptions(settings: Settings): monaco.editor.IStandaloneEditorConstructionOptions {
    return {
        lineNumbers: settings.showLineNumbers? 'on' : 'off',
        cursorBlinking: settings.cursorBlinking,
        cursorSmoothCaretAnimation: settings.smoothCursor? 'on' : 'off',
        minimap: {
            enabled: false,
        },
        smoothScrolling: true,
        wordBasedSuggestions: 'off',
        wordWrap: 'on',
        renderLineHighlight: settings.highlightCurrentLine? 'all' : 'none',
        theme: settings.theme.name,
        fontSize: settings.fontSize,
        padding: {
            top: 50,
            bottom: 30
        },
        selectionHighlight: false,
        matchBrackets: 'never',
        folding: false,
        occurrencesHighlight: 'off',
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
        lineDecorationsWidth: settings.showLineNumbers? 30 : 0,
        stickyScroll: {
            enabled: false
        }
    };
}

export default App;
