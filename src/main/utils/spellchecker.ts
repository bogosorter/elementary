import { Nodehun } from 'nodehun';
import type * as Monaco from 'monaco-editor'
import { join as joinPath } from 'path';
import { readFile, access , readdir} from 'fs/promises';
import { assetsPath } from './utils';

let spellchecker: Nodehun | null = null;

export async function loadSpellchecker(language: string) {
    const dictionary = await getDictionary(language);
    if (!dictionary) return false;

    spellchecker = new Nodehun(dictionary.aff, dictionary.dic);
    return true;
}

// Spellchecking has to be done on the main process, since Nodehun is not
// available in the renderer process. This code is heavily inspired on
// purocean's monaco-spellchecker:
// https://github.com/purocean/monaco-spellchecker
export async function spellcheck(lines: string[], tokens: Monaco.Token[][]) {
    const result: Monaco.editor.IMarkerData[] = [];

    // Tokens whose type is code, math, etc., should not be spellchecked.
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

    // Used to signal if we are inside a code block, since the tokens inside it
    // may have other types
    let codeOpen = false;

    for (let lineIndex = 0; lineIndex < tokens.length; lineIndex++) {
        if (result.length > 500) {
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
            const endColumn = i === tokens[lineIndex].length - 1?
                lines[lineIndex].length + 1 :
                tokens[lineIndex][i + 1].offset + 1;

            const text = lines[lineIndex].substring(startColumn - 1, endColumn - 1);

            // Regex adapted to match alphabetic non-ASCII characters as well
            const wordReg = /(?<!\p{L})[\p{L}']+(?!\p{L})/gu;
            let match: RegExpExecArray | null;

            while ((match = wordReg.exec(text)) !== null) {
                const { 0: word, index: pos } = match;
                if (word.length < 2) continue;

                const isCorrect = await spellchecker?.spell(word) ?? false;

                if (!isCorrect) result.push({
                    code: word,
                    startLineNumber: lineIndex + 1,
                    startColumn: pos + startColumn,
                    endLineNumber: lineIndex + 1,
                    endColumn: pos + startColumn + word.length,
                    message: 'error',
                    // The enum type can't be used here since only the types are
                    // imported from monaco
                    severity: 8
                });
            }
        }
    }

    return result;
}

export async function availableDictionaries() {
    const dictionariesPath = joinPath(assetsPath(), 'dictionaries');
    await access(dictionariesPath);
    const files = await readdir(dictionariesPath);
    return files
        .filter(file => file.endsWith('.dic'))
        .map(file => file.replace('.dic', ''));
}

export async function getDictionary(language: string) {
    const dictionariesPath = joinPath(assetsPath(), 'dictionaries');
    const dicPath = joinPath(dictionariesPath, language + '.dic');
    const affPath = joinPath(dictionariesPath, language + '.aff');

    try {
        await access(dicPath);
        await access(affPath);

        const dic = (await readFile(dicPath));
        const aff = (await readFile(affPath));
        return { dic, aff };
    } catch {
        return null;
    }
}
