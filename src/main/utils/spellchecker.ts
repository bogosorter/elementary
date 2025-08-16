import { Nodehun } from 'nodehun';
import type * as Monaco from 'monaco-editor'
import { join as joinPath } from 'path';
import { readFile, writeFile, access, readdir } from 'fs/promises';
import { distance } from 'fastest-levenshtein';
import { assetsPath } from './utils';

let language: string | null = null;
let spellchecker: Nodehun | null = null;

type UserDictionary = {
    included: Set<string>;
    excluded: Set<string>;
}
let userDictionary: UserDictionary | null = null;

export async function loadSpellchecker(lang: string) {
    if (language === lang) return true;

    const dictionary = await getDictionary(lang);
    if (!dictionary) return false;

    language = lang;
    spellchecker = new Nodehun(dictionary.aff, dictionary.dic);
    userDictionary = await getUserDictionary(lang);
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

                const dictionaryIncludes = await spellchecker?.spell(word) ?? false;
                const userDictionaryIncludes = userDictionary?.included.has(word) ?? false;
                const userDictionaryExcludes = userDictionary?.excluded.has(word) ?? false;
                const correct = (dictionaryIncludes || userDictionaryIncludes) && !userDictionaryExcludes;

                if (!correct) result.push({
                    code: word,
                    startLineNumber: lineIndex + 1,
                    startColumn: pos + startColumn,
                    endLineNumber: lineIndex + 1,
                    endColumn: pos + startColumn + word.length,
                    message: word,
                    // The enum type can't be used here since only the types are
                    // imported from monaco
                    severity: 8
                });
            }
        }
    }

    return result;
}

export function suggest(word: string) {
    if (!spellchecker) return [];

    let suggestions = spellchecker.suggestSync(word) ?? [];
    suggestions = suggestions.sort((a, b) => distance(word, a) - distance(word, b));
    return suggestions.splice(0, 5);
}

export async function addToUserDictionary(word: string) {
    if (!userDictionary) return;

    userDictionary.included.add(word);
    userDictionary.excluded.delete(word);
    await updateUserDictionary(language!);
}

export async function removeFromUserDictionary(word: string) {
    if (!userDictionary) return;

    userDictionary.included.delete(word);
    userDictionary.excluded.add(word);
    await updateUserDictionary(language!);
}

export async function availableDictionaries() {
    const dictionariesPath = joinPath(assetsPath(), 'dictionaries');
    await access(dictionariesPath);
    const files = await readdir(dictionariesPath);
    return files
        .filter(file => file.endsWith('.dic'))
        .map(file => file.replace('.dic', ''));
}

async function getDictionary(language: string) {
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

async function getUserDictionary(language: string): Promise<UserDictionary> {
    const userDictPath = joinPath(assetsPath(), 'dictionaries', language + '.user.txt');
    try {
        await access(userDictPath);
        const content = (await readFile(userDictPath, 'utf-8')).split('\n');

        const included = new Set(content.filter(word => !word.startsWith('-')));
        const excluded = new Set(content.filter(word => word.startsWith('-')).map(word => word.slice(1)));
        return { included, excluded };
    } catch {
        return {
            included: new Set<string>(),
            excluded: new Set<string>()
        };
    }
}

async function updateUserDictionary(language: string) {
    if (!userDictionary) return;

    const userDictPath = joinPath(assetsPath(), 'dictionaries', language + '.user.txt');
    const content = Array.from(userDictionary.included)
        .concat(Array.from(userDictionary.excluded).map(word => '-' + word))
        .join('\n');

    await writeFile(userDictPath, content, 'utf-8');
}
