// An adapted version of purocean's spellchecker for Monaco Editor
// https://github.com/purocean/monaco-spellchecker/tree/main

import * as Monaco from 'monaco-editor'

type XRange = Pick<Monaco.Range, 'startLineNumber' | 'startColumn' | 'endLineNumber' | 'endColumn'>

interface Spellchecker {
    process: () => void
    dispose: () => void
}

interface Options {
    severity?: Monaco.MarkerSeverity
    languageSelector?: Monaco.languages.LanguageSelector
    check: (word: string) => (boolean | Promise<boolean>)
    suggest: (word: string) => (string[] | Promise<string[]>)
    ignore?: (word: string) => (void | Promise<void>)
    addWord?: (word: string) => (void | Promise<void>)
    messageBuilder?: (type: 'hover-message' | 'ignore' | 'add-word' | 'apply-suggestion', word: string, range?: XRange, opts?: Options) => string
}

export const ignoreActionId = 'spellchecker.ignore'
export const addWordActionId = 'spellchecker.addWord'
export const correctActionId = 'spellchecker.correct'

function buildCustomEditorId (actionId: string) {
    return `vs.editor.ICodeEditor:1:${actionId}`
}

export const defaultMessageBuilder: NonNullable<Options['messageBuilder']> = (type, word) => {
    switch (type) {
        case 'hover-message':
            return `"${word}" is misspelled.`
        case 'ignore':
            return `Ignore "${word}"`
        case 'add-word':
            return `Add "${word}" to Dictionary`
        case 'apply-suggestion':
            return `Replace with "${word}"`
        default:
            return ''
    }
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
    opts: Options
): Spellchecker {
    const {
        check,
        suggest,
        ignore,
        addWord,
        messageBuilder = defaultMessageBuilder,
        languageSelector = '*'
    } = opts

    const owner = 'spellchecker'
    let disposed = false

    const process = async () => {
        if (disposed) return;

        const model = editor.getModel();
        if (!model) return;

        const marks: Monaco.editor.IMarkerData[] = [];
        const tokens = monaco.editor.tokenize(model.getValue(), model.getLanguageId());

        const shouldSpellcheck = (type: string) => {
            if (type === '') return true;
            if (type === 'heading1.md') return true;
            if (type === 'heading2.md') return true;
            if (type === 'heading3.md') return true;
            if (type === 'heading4.md') return true;
            if (type === 'heading5.md') return true;
            if (type === 'heading6.md') return true;
            if (type === 'strong.md') return true;
            if (type === 'emphasis.md') return true;
            if (type === 'strikethrough.md') return true;
            if (type === 'string.link.md') return true;
            return false;
        }

        let codeOpen = false;

        for (let lineIndex = 0; lineIndex < tokens.length; lineIndex++) {
            if (marks.length > 500) {
                // monaco editor has a limit of 500 markers.
                // https://github.com/microsoft/monaco-editor/issues/2042
                break;
            }

            for (let i = 0; i < tokens[lineIndex].length; i++) {
                const token = tokens[lineIndex][i];

                if (token.type === 'code-start.md') codeOpen = true;
                else if (token.type === 'code-end.md') codeOpen = false;
                if (codeOpen || !shouldSpellcheck(token.type)) continue;

                const startColumn = token.offset + 1;
                const endColumn = i === tokens[lineIndex].length - 1
                    ? model.getLineMaxColumn(lineIndex + 1)
                    : tokens[lineIndex][i + 1].offset + 1;

                const text = model.getValueInRange({
                    startLineNumber: lineIndex + 1,
                    startColumn,
                    endLineNumber: lineIndex + 1,
                    endColumn,
                });

                // Regex adapted for international purposes
                const wordReg = /(?<!\p{L})[\p{L}']+(?!\p{L})/gu;
                let match: RegExpExecArray | null;

                while ((match = wordReg.exec(text)) !== null) {
                    const { 0: word, index: pos } = match;
                    if (word.length < 2) continue;

                    const result = check(word);
                    const isCorrect = typeof result === 'boolean' ? result : await result;
                    if (disposed) return;

                    if (!isCorrect) {
                        const range = {
                            startLineNumber: lineIndex + 1,
                            startColumn: pos + startColumn,
                            endLineNumber: lineIndex + 1,
                            endColumn: pos + startColumn + word.length,
                        };

                        marks.push({
                            code: word,
                            startLineNumber: range.startLineNumber,
                            startColumn: range.startColumn,
                            endLineNumber: range.endLineNumber,
                            endColumn: range.endColumn,
                            message: messageBuilder('hover-message', word, range, opts),
                            severity: opts.severity || monaco.MarkerSeverity.Warning,
                        });
                    }
                }
            }
        }

        monaco.editor.setModelMarkers(model, owner, marks);
    }

    const codeActionProvider: Monaco.languages.CodeActionProvider = {
        provideCodeActions: async function(model, range, _context, token) {
            if (disposed) return null

            const markers = monaco.editor.getModelMarkers({ owner: owner, resource: model.uri })
            const marker = markers.find(marker => range.containsRange.call(marker, range))
            if (!marker) return null

            const actions: Monaco.languages.CodeAction[] = []

            const word = marker.code as string

            const result = suggest(word)
            const list = await Promise.resolve(result)

            if (token.isCancellationRequested) return null

            list.forEach(suggestion => {
                actions.push({
                    title: suggestion,
                    command: {
                        id: buildCustomEditorId(correctActionId),
                        title: messageBuilder('apply-suggestion', suggestion, marker, opts),
                        arguments: [{
                            range: marker,
                            suggestion: suggestion,
                        }],
                    },
                    ranges: [marker],
                    kind: 'quickfix'
                })
            })

            if (ignore) {
                const title = messageBuilder('ignore', word, marker, opts)
                actions.push({
                    title,
                    command: {
                        id: buildCustomEditorId(ignoreActionId),
                        title,
                        arguments: [word],
                    },
                    ranges: [marker],
                    kind: 'quickfix'
                })
            }

            if (addWord) {
                const title = messageBuilder('add-word', word, marker, opts)
                actions.push({
                    title,
                    command: {
                        id: buildCustomEditorId(addWordActionId),
                        title,
                        arguments: [word],
                    },
                    ranges: [marker],
                    kind: 'quickfix'
                })
            }


            return { actions, dispose: () => {} }
        },
    }

    const disposables: Monaco.IDisposable[] = [
        editor.addAction({
            id: correctActionId,
            label: 'Spellchecker: Correct',
            run: (editor, args) => {
                if (!args || !args.range || !args.suggestion) return

                const model = editor.getModel()
                if (!model) return

                const { range, suggestion } = args

                editor.pushUndoStop()
                editor.executeEdits(owner, [{
                    range,
                    text: suggestion,
                }])
            },
        }),
        monaco.languages.registerCodeActionProvider(languageSelector, codeActionProvider)
    ]

    if (ignore) {
        disposables.push(
            editor.addAction({
                id: ignoreActionId,
                label: 'Spellchecker: Ignore',
                run: async (_, word) => {
                    if (word) {
                        await ignore(word)
                        process()
                    }
                },
            })
        )
    }

    if (addWord) {
        disposables.push(
            editor.addAction({
                id: addWordActionId,
                label: 'Spellchecker: Add to Dictionary',
                run: async (_, word) => {
                    if (word) {
                        await addWord(word)
                        process()
                    }
                },
            })
        )
    }

    const dispose = () => {
        monaco.editor.removeAllMarkers(owner)
        disposables.forEach(disposable => disposable.dispose())
        disposables.length = 0
        disposed = true
    }

    return { process, dispose }
}
