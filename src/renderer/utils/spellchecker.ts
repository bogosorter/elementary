// An adapted version of purocean's spellchecker for Monaco Editor
// https://github.com/purocean/monaco-spellchecker/tree/main

import * as Monaco from 'monaco-editor'

interface Spellchecker {
    process: () => void
    dispose: () => void
}

/**
 * Initialize the spellchecker for the Monaco Editor.
 *
 * @param editor - The Monaco Editor instance.
 * @param opts - The options for the spellchecker.
 */
export function getSpellchecker(
    monaco: typeof Monaco,
    editor: Monaco.editor.IStandaloneCodeEditor,
): Spellchecker {

    const owner = 'spellchecker';
    let disposed = false;
    let spellingActions: Monaco.IDisposable[] = [];

    // Perform the actual spellchecking
    const process = async () => {
        if (disposed) return;

        const model = editor.getModel();
        if (!model) return;

        const lines = model.getLinesContent();
        const tokens = monaco.editor.tokenize(model.getValue(), model.getLanguageId());
        const marks = await window.electron.ipcRenderer.invoke('spellcheck', lines, tokens);

        monaco.editor.setModelMarkers(model, owner, marks);
    }

    // Provide actions when clicking on misspelled words
    const contextMenuListener = editor.onContextMenu((e) => {
        // Remove all the actions that may have been added before
        spellingActions.forEach(action => action.dispose());
        spellingActions.length = 0;

        const position = e.target.position;
        if (!position) return;

        const model = editor.getModel();
        if (!model) return;

        const word = model.getWordAtPosition(position);
        if (!word) return;

        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        const marker = markers.find(marker =>
            position.lineNumber >= marker.startLineNumber &&
            position.lineNumber <= marker.endLineNumber &&
            position.column >= marker.startColumn &&
            position.column <= marker.endColumn
        );
        if (!marker || marker.owner !== owner) {
            // This is not a misspelled word, so add option to remove from
            // dictionary
            spellingActions.push(editor.addAction({
                id: 'spellchecker-remove-from-dictionary',
                label: 'Remove from dictionary',
                contextMenuGroupId: 'spellcheck',
                contextMenuOrder: 0,
                run: () => {
                    const wordToRemove = word.word;
                    window.electron.ipcRenderer.invoke('removeFromUserDictionary', wordToRemove);
                    process();
                }
            }));
            return;
        }

        // Add "Add to dictionary" action
        spellingActions.push(editor.addAction({
            id: 'spellchecker-add-to-dictionary',
            label: 'Add to dictionary',
            contextMenuGroupId: 'spellcheck',
            contextMenuOrder: 0,
            run: () => {
                const wordToAdd = word.word;
                window.electron.ipcRenderer.invoke('addToUserDictionary', wordToAdd);
                process();
            }
        }));

        // Add spelling sugestions
        const suggestions: string[] = window.electron.ipcRenderer.sendSync('suggest', word.word);
        suggestions.forEach((suggestion, index) => spellingActions.push(editor.addAction({
            id: `spellchecker-suggestion-${index}`,
            label: suggestion,
            contextMenuGroupId: 'spellcheck',
            contextMenuOrder: index + 1,
            run: () => {
                const range = new monaco.Range(
                    position.lineNumber,
                    word.startColumn,
                    position.lineNumber,
                    word.endColumn
                );

                editor.pushUndoStop();
                editor.executeEdits(owner, [{
                    range,
                    text: suggestion,
                    forceMoveMarkers: true
                }]);
                editor.pushUndoStop();

                const newMarkers = markers.filter(marker => marker !== marker);
                monaco.editor.setModelMarkers(model, owner, newMarkers);
            }
        })));
    });

    const dispose = () => {
        monaco.editor.removeAllMarkers(owner)
        spellingActions.forEach(action => action.dispose());
        spellingActions.length = 0;
        contextMenuListener.dispose();
        disposed = true
    }

    return { process, dispose }
}
