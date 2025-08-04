import { Command } from 'cmdk';
import './CommandPalette.css';
import { lightTheme, darkTheme, commaTheme } from '../../themes';
import store from '../store/store';
import { CSSProperties, useEffect, useState } from 'react';
import makeRecentFile from '../utils/makeRecentFile';

export default function CommandPalette() {

    const theme = store(state => state.settings.theme);
    const recentlyOpened = store(state => state.recentlyOpened);
    const commandPaletteOpen = store(state => state.commandPalette.open);
    const commandPalettePage = store(state => state.commandPalette.page);

    const [value, setValue] = useState('');

    const items = commandPalettePage == 'recentlyOpened' ? recentlyOpened.map(makeRecentFile) : actions[commandPalettePage];

    useEffect(() => {
        setValue('');
        if (!commandPaletteOpen) {
            if (store.getState().preview) {
                const preview = document.getElementById('preview')!;
                preview.focus();
            } else store.getState().editor?.focus();
        }
    }, [commandPaletteOpen, commandPalettePage]);

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
                    items.map(({ label, action }, index) => (
                        <Command.Item
                            key={index}
                            onSelect={() => {
                                setValue('');
                                action();
                            }}
                            style={{ color: theme.primary }}
                        >
                            {label}
                        </Command.Item>
                    ))
                }
            </Command.List>
        </Command.Dialog>
    );
}

const actions = {
    general: [
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
        }
    ],
    theme: [
        {
            label: 'Theme: Light',
            action: () => store.getState().changeSetting('theme', lightTheme)
        }, {
            label: 'Theme: Dark',
            action: () => store.getState().changeSetting('theme', darkTheme)
        }, {
            label: 'Theme: Comma',
            action: () => store.getState().changeSetting('theme', commaTheme)
        }
    ],
    zoom: [75, 90, 100, 110, 125, 140, 150, 175, 200].map(z => ({
        label: `Zoom: ${z}%`,
        action: () => store.getState().changeSetting('zoom', z / 100)
    })),
    fontSize: [12, 14, 16, 18, 20, 22, 24, 26, 28].map(fontSize => ({
        label: `Font Size: ${fontSize}px`,
        action: () => store.getState().changeSetting('fontSize', fontSize)
    })),
    editorWidth: [600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600].map(editorWidth => ({
        label: `Editor Width: ${editorWidth}px`,
        action: () => store.getState().changeSetting('editorWidth', editorWidth)
    })),
    interfaceComplexity: [
        {
            label: 'Normal',
            action: () => store.getState().changeSetting('interfaceComplexity', 'normal')
        }, {
            label: 'Minimal',
            action: () => store.getState().changeSetting('interfaceComplexity', 'minimal')
        }
    ],
    autoSave: [0, 1000, 2000, 3000, 4000, 5000, 10000].map(period => ({
        label: period? `Auto Save: ${period / 1000}s` : 'Auto Save: off',
        action: () => store.getState().changeSetting('autoSave', period)
    })),
    showLineNumbers: [
        {
            label: 'Show Line Numbers',
            action: () => store.getState().changeSetting('showLineNumbers', true)
        }, {
            label: 'Hide Line Numbers',
            action: () => store.getState().changeSetting('showLineNumbers', false)
        }
    ],
    sidebar: [
        {
            label: 'Hidden',
            action: () => store.getState().changeSetting('sidebar', 'hidden')
        }, {
            label: 'File Actions',
            action: () => store.getState().changeSetting('sidebar', 'fileActions')
        }, {
            label: 'Markdown Actions',
            action: () => store.getState().changeSetting('sidebar', 'markdownActions')
        }, {
            label: 'All',
            action: () => store.getState().changeSetting('sidebar', 'all')
        }
    ],
    highlightCurrentLine: [
        {
            label: 'Highlight Current Line',
            action: () => store.getState().changeSetting('highlightCurrentLine', true)
        }, {
            label: 'Do Not Highlight Current Line',
            action: () => store.getState().changeSetting('highlightCurrentLine', false)
        }
    ],
    previewTextAlign: [
        {
            label: 'Left',
            action: () => store.getState().changeSetting('previewTextAlign', 'left')
        }, {
            label: 'Center',
            action: () => store.getState().changeSetting('previewTextAlign', 'center')
        }, {
            label: 'Right',
            action: () => store.getState().changeSetting('previewTextAlign', 'right')
        }, {
            label: 'Justify',
            action: () => store.getState().changeSetting('previewTextAlign', 'justify')
        }
    ],
    cursorBlinking: [
        {
            label: 'Blink',
            action: () => store.getState().changeSetting('cursorBlinking', 'blink')
        }, {
            label: 'Smooth',
            action: () => store.getState().changeSetting('cursorBlinking', 'smooth')
        }, {
            label: 'Phase',
            action: () => store.getState().changeSetting('cursorBlinking', 'phase')
        }, {
            label: 'Expand',
            action: () => store.getState().changeSetting('cursorBlinking', 'expand')
        }, {
            label: 'Solid',
            action: () => store.getState().changeSetting('cursorBlinking', 'solid')
        }
    ],
    smoothCursor: [
        {
            label: 'Enable smooth cursor',
            action: () => store.getState().changeSetting('smoothCursor', true)
        }, {
            label: 'Disable smooth cursor',
            action: () => store.getState().changeSetting('smoothCursor', false)
        }
    ],
    automaticExportFilename: [
        {
            label: 'Enable automatic PDF export filename',
            action: () => store.getState().changeSetting('automaticExportFilename', true)
        }, {
            label: 'Disable automatic PDF export filename',
            action: () => store.getState().changeSetting('automaticExportFilename', false)
        }
    ],
    prereleaseNotification: [
        {
            label: 'Enable pre-release notification',
            action: () => store.getState().changeSetting('prereleaseNotification', true)
        }, {
            label: 'Disable pre-release notification',
            action: () => store.getState().changeSetting('prereleaseNotification', false)
        }
    ]
};
