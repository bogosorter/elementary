import { Command } from 'cmdk';
import { lightTheme, darkTheme, commaTheme } from '../../themes';
import store from '../store/store';
import { CSSProperties, useEffect, useState } from 'react';
import makeRecentFile from '../utils/makeRecentFile';
import { Settings } from '../../settings';
import './CommandPalette.css';

export type CommandPaletteAction = {
    label: string | React.ReactNode;
    action: () => void;
    selected?: () => boolean;
}

export default function CommandPalette() {

    const theme = store(state => state.settings.theme);
    const recentlyOpened = store(state => state.recentlyOpened);
    const commandPaletteOpen = store(state => state.commandPalette.open);
    const commandPalettePage = store(state => state.commandPalette.page);
    const dictionaries = store(state => state.dictionaries);

    const [value, setValue] = useState('');


    useEffect(() => {
        setValue('');
        if (!commandPaletteOpen) {
            if (store.getState().preview) {
                const preview = document.getElementById('preview')!;
                preview.focus();
            } else store.getState().editor?.focus();
        }
    }, [commandPaletteOpen, commandPalettePage]);

    const actions = buildActions(commandPalettePage, recentlyOpened, dictionaries);

    return (
        <Command.Dialog
            open={commandPaletteOpen}
            onOpenChange={store.getState().toggleCommandPalette}
            style={{ backgroundColor: theme.surface }}
            loop
        >
            <Command.Input
                value={value}
                onValueChange={setValue}
                placeholder='Type a command'
                style={{ backgroundColor: theme.surfaceVariant, color: theme.primary, '--color': theme.primary } as CSSProperties}
            />
            <Command.List>
                <Command.Empty style={{ color: theme.primary }}>No results found <span className='emoticon'>:(</span></Command.Empty>
                {
                    actions.map((item, index) => (
                        <Command.Item
                            key={index}
                            onSelect={() => {
                                setValue('');
                                item.action();
                            }}
                            style={{ color: theme.primary }}
                        >
                            {item.selected?.() && <span id='selected-option' style={{ backgroundColor: theme.accent }}></span>}
                            {item.label}
                        </Command.Item>
                    ))
                }
            </Command.List>
        </Command.Dialog>
    );
}

function buildActions(page: 'general' | 'recentlyOpened' | keyof Settings, recentlyOpened: string[], dictionaries: string[]): CommandPaletteAction[] {
    if (page === 'general') return [
        {
            label: 'File: Open',
            action: () => store.getState().open()
        }, {
            label: 'File: Open Recent',
            action: () => store.getState().openRecent()
        }, {
            label: 'File: Save',
            action: () => store.getState().save()
        }, {
            label: 'File: Save As',
            action: () => store.getState().saveAs()
        }, {
            label: 'File: New',
            action: () => store.getState().newFile()
        }, {
            label: 'File: Preview',
            action: () => store.getState().togglePreview()
        }, {
            label: 'File: Export to PDF',
            action: () => store.getState().exportToPDF()
        }, {
            label: 'Settings: Theme',
            action: () => store.getState().changeSetting('theme')
        }, {
            label: 'Settings: Font Size',
            action: () => store.getState().changeSetting('fontSize')
        }, {
            label: 'Settings: Zoom',
            action: () => store.getState().changeSetting('zoom')
        }, {
            label: 'Settings: Editor Width',
            action: () => store.getState().changeSetting('editorWidth')
        }, {
            label: 'Settings: Interface Complexity',
            action: () => store.getState().changeSetting('interfaceComplexity')
        }, {
            label: 'Settings: Auto Save',
            action: () => store.getState().changeSetting('autoSave')
        }, {
            label: 'Settings: Line numbers',
            action: () => store.getState().changeSetting('showLineNumbers')
        }, {
            label: 'Settings: Sidebar',
            action: () => store.getState().changeSetting('sidebar')
        }, {
            label: 'Settings: Highlight current line',
            action: () => store.getState().changeSetting('highlightCurrentLine')
        }, {
            label: 'Settings: Preview text alignment',
            action: () => store.getState().changeSetting('previewTextAlign')
        }, {
            label: 'Settings: Cursor blinking',
            action: () => store.getState().changeSetting('cursorBlinking')
        }, {
            label: 'Settings: Smooth cursor',
            action: () => store.getState().changeSetting('smoothCursor')
        }, {
            label: 'Settings: Automatic PDF export filename',
            action: () => store.getState().changeSetting('automaticExportFilename')
        }, {
            label: 'Settings: Pre-release notification',
            action: () => store.getState().changeSetting('prereleaseNotification')
        }, {
            label: 'Settings: Spellchecking',
            action: () => store.getState().changeSetting('dictionary')
        }, {
            label: 'Settings: Reset',
            action: () => store.getState().resetSettings()
        }, {
            label: 'Markdown: Bold',
            action: () => store.getState().bold()
        }, {
            label: 'Markdown: Italic',
            action: () => store.getState().italic()
        }, {
            label: 'Markdown: Strikethrough',
            action: () => store.getState().strikethrough()
        }, {
            label: 'Markdown: Inline Code',
            action: () => store.getState().inlineCode()
        }, {
            label: 'Markdown: Link',
            action: () => store.getState().link()
        }, {
            label: 'Markdown: Heading',
            action: () => store.getState().heading()
        }, {
            label: 'Markdown: Quote',
            action: () => store.getState().quote()
        }, {
            label: 'Markdown: Unordered List',
            action: () => store.getState().unorderedList()
        }, {
            label: 'Markdown: Ordered List',
            action: () => store.getState().orderedList()
        }, {
            label: 'Markdown: Todo List',
            action: () => store.getState().todoList()
        }, {
            label: 'Markdown: Uppercase',
            action: () => store.getState().uppercase()
        }, {
            label: 'Markdown: Lowercase',
            action: () => store.getState().lowercase()
        }, {
            label: 'Markdown: Duplicate Lines',
            action: () => store.getState().duplicateLines()
        }, {
            label: 'Elementary: About',
            action: () => store.getState().openInfo()
        }, {
            label: 'Elementary: Update Notice',
            action: () => store.getState().openUpdateNotice()
        }, {
            label: 'Elementary: Markdown Reference',
            action: () => store.getState().openMarkdownReference()
        }, {
            label: 'Elementary: Shortcut Reference',
            action: () => store.getState().openShortcutReference()
        }, {
            label: 'Elementary: PDF Export Guide',
            action: () => store.getState().openPDFExportGuide()
        }, {
            label: 'Elementary: Markdown Math Guide',
            action: () => store.getState().openMath()
        }, {
            label: 'Elementary: Spellchecking Guide',
            action: () => store.getState().openSpellcheckingGuide()
        }
    ];

    else if (page === 'recentlyOpened') return recentlyOpened.map(makeRecentFile);

    else if (page === 'theme') return [
        {
            label: 'Theme: Light',
            action: () => store.getState().changeSetting('theme', lightTheme),
            selected: () => store.getState().settings.theme.name === 'light'
        }, {
            label: 'Theme: Dark',
            action: () => store.getState().changeSetting('theme', darkTheme),
            selected: () => store.getState().settings.theme.name === 'dark'
        }, {
            label: 'Theme: Comma',
            action: () => store.getState().changeSetting('theme', commaTheme),
            selected: () => store.getState().settings.theme.name === 'comma'
        }
    ];

    else if (page === 'zoom') return [75, 90, 100, 110, 125, 140, 150, 175, 200].map(z => ({
        label: `Zoom: ${z}%`,
        action: () => store.getState().changeSetting('zoom', z / 100),
        selected: () => store.getState().settings.zoom === z / 100
    }));

    else if (page === 'fontSize') return [12, 14, 16, 18, 20, 22, 24, 26, 28].map(fontSize => ({
        label: `Font Size: ${fontSize}px`,
        action: () => store.getState().changeSetting('fontSize', fontSize),
        selected: () => store.getState().settings.fontSize === fontSize
    }));

    else if (page === 'editorWidth') return [600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600].map(editorWidth => ({
        label: `Editor Width: ${editorWidth}px`,
        action: () => store.getState().changeSetting('editorWidth', editorWidth),
        selected: () => store.getState().settings.editorWidth === editorWidth
    }));

    else if (page === 'interfaceComplexity') return [
        {
            label: 'Normal',
            action: () => store.getState().changeSetting('interfaceComplexity', 'normal'),
            selected: () => store.getState().settings.interfaceComplexity === 'normal'
        }, {
            label: 'Minimal',
            action: () => store.getState().changeSetting('interfaceComplexity', 'minimal'),
            selected: () => store.getState().settings.interfaceComplexity === 'minimal'
        }
    ];

    else if (page === 'autoSave') return [0, 1000, 2000, 3000, 4000, 5000, 10000].map(period => ({
        label: period? `Auto Save: ${period / 1000}s` : 'Auto Save: off',
        action: () => store.getState().changeSetting('autoSave', period),
        selected: () => store.getState().settings.autoSave === period
    }));

    else if (page === 'showLineNumbers') return [
        {
            label: 'Show Line Numbers',
            action: () => store.getState().changeSetting('showLineNumbers', true),
            selected: () => store.getState().settings.showLineNumbers === true
        }, {
            label: 'Hide Line Numbers',
            action: () => store.getState().changeSetting('showLineNumbers', false),
            selected: () => store.getState().settings.showLineNumbers === false
        }
    ];

    else if (page === 'sidebar') return [
        {
            label: 'Hidden',
            action: () => store.getState().changeSetting('sidebar', 'hidden'),
            selected: () => store.getState().settings.sidebar === 'hidden'
        }, {
            label: 'File Actions',
            action: () => store.getState().changeSetting('sidebar', 'fileActions'),
            selected: () => store.getState().settings.sidebar === 'fileActions'
        }, {
            label: 'Markdown Actions',
            action: () => store.getState().changeSetting('sidebar', 'markdownActions'),
            selected: () => store.getState().settings.sidebar === 'markdownActions'
        }, {
            label: 'All',
            action: () => store.getState().changeSetting('sidebar', 'all'),
            selected: () => store.getState().settings.sidebar === 'all'
        }
    ];

    else if (page === 'highlightCurrentLine') return [
        {
            label: 'Highlight Current Line',
            action: () => store.getState().changeSetting('highlightCurrentLine', true),
            selected: () => store.getState().settings.highlightCurrentLine === true
        }, {
            label: 'Do Not Highlight Current Line',
            action: () => store.getState().changeSetting('highlightCurrentLine', false),
            selected: () => store.getState().settings.highlightCurrentLine === false
        }
    ];

    else if (page === 'previewTextAlign') return [
        {
            label: 'Left',
            action: () => store.getState().changeSetting('previewTextAlign', 'left'),
            selected: () => store.getState().settings.previewTextAlign === 'left'
        }, {
            label: 'Center',
            action: () => store.getState().changeSetting('previewTextAlign', 'center'),
            selected: () => store.getState().settings.previewTextAlign === 'center'
        }, {
            label: 'Right',
            action: () => store.getState().changeSetting('previewTextAlign', 'right'),
            selected: () => store.getState().settings.previewTextAlign === 'right'
        }, {
            label: 'Justify',
            action: () => store.getState().changeSetting('previewTextAlign', 'justify'),
            selected: () => store.getState().settings.previewTextAlign === 'justify'
        }
    ];

    else if (page === 'cursorBlinking') return [
        {
            label: 'Blink',
            action: () => store.getState().changeSetting('cursorBlinking', 'blink'),
            selected: () => store.getState().settings.cursorBlinking === 'blink'
        }, {
            label: 'Smooth',
            action: () => store.getState().changeSetting('cursorBlinking', 'smooth'),
            selected: () => store.getState().settings.cursorBlinking === 'smooth'
        }, {
            label: 'Phase',
            action: () => store.getState().changeSetting('cursorBlinking', 'phase'),
            selected: () => store.getState().settings.cursorBlinking === 'phase'
        }, {
            label: 'Expand',
            action: () => store.getState().changeSetting('cursorBlinking', 'expand'),
            selected: () => store.getState().settings.cursorBlinking === 'expand'
        }, {
            label: 'Solid',
            action: () => store.getState().changeSetting('cursorBlinking', 'solid'),
            selected: () => store.getState().settings.cursorBlinking === 'solid'
        }
    ];

    else if (page === 'smoothCursor') return [
        {
            label: 'Enable smooth cursor',
            action: () => store.getState().changeSetting('smoothCursor', true),
            selected: () => store.getState().settings.smoothCursor === true
        }, {
            label: 'Disable smooth cursor',
            action: () => store.getState().changeSetting('smoothCursor', false),
            selected: () => store.getState().settings.smoothCursor === false
        }
    ];

    else if (page === 'automaticExportFilename') return [
        {
            label: 'Enable automatic PDF export filename',
            action: () => store.getState().changeSetting('automaticExportFilename', true),
            selected: () => store.getState().settings.automaticExportFilename === true
        }, {
            label: 'Disable automatic PDF export filename',
            action: () => store.getState().changeSetting('automaticExportFilename', false),
            selected: () => store.getState().settings.automaticExportFilename === false
        }
    ];

    else if (page === 'prereleaseNotification') return [
        {
            label: 'Enable pre-release notification',
            action: () => store.getState().changeSetting('prereleaseNotification', true),
            selected: () => store.getState().settings.prereleaseNotification === true
        }, {
            label: 'Disable pre-release notification',
            action: () => store.getState().changeSetting('prereleaseNotification', false),
            selected: () => store.getState().settings.prereleaseNotification === false
        }
    ];

    else return [
        {
            label: 'disabled',
            action: () => store.getState().changeSetting('dictionary', null),
            selected: () => store.getState().settings.dictionary === null
        },
        ...dictionaries.map(language => ({
            label: language,
            action: () => store.getState().changeSetting('dictionary', language),
            selected: () => store.getState().settings.dictionary === language
        }))
    ];
}
