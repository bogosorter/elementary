import { Command } from 'cmdk';
import './CommandPalette.css';
import { lightTheme, darkTheme, commaTheme } from '../../themes';
import store from '../store/store';
import { CSSProperties, useEffect, useState } from 'react';

export default function CommandPalette() {

    const theme = store(state => state.settings.theme);
    const recentlyOpened = store(state => state.recentlyOpened);
    const commandPaletteOpen = store(state => state.commandPaletteOpen);
    const commandPalettePage = store(state => state.commandPalettePage);

    const [value, setValue] = useState('');

    const items = commandPalettePage == 'recentlyOpened' ? recentlyOpened.map(path => ({
        label: path,
        action: () => store.getState().openRecent(path)
    })) : actions[commandPalettePage];

    useEffect(() => {
        setValue('');
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
                    items.map(({ label, action }) => (
                        <Command.Item
                            key={label}
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
            label: 'Theme: Light',
            action: () => store.getState().setTheme(lightTheme)
        }, {
            label: 'Theme: Dark',
            action: () => store.getState().setTheme(darkTheme)
        }, {
            label: 'Theme: Comma',
            action: () => store.getState().setTheme(commaTheme)
        }, {
            label: 'Font Size',
            action: () => store.getState().setFontSize()
        }, {
            label: 'Zoom',
            action: () => store.getState().setZoom()
        }, {
            label: 'Editor Width',
            action: () => store.getState().setEditorWidth()
        }, {
            label: 'Interface Complexity',
            action: () => store.getState().setInterfaceComplexity()
        }, {
            label: 'Auto Save',
            action: () => store.getState().setAutoSave()
        }, {
            label: 'About Elementary',
            action: () => store.getState().openInfo()
        }, {
            label: 'Markdown Reference',
            action: () => store.getState().openMarkdownReference()
        }, {
            label: 'Shortcut Reference',
            action: () => store.getState().openShortcutReference()
        }
    ],
    zoom: [75, 90, 100, 110, 125, 140, 150, 175, 200].map(z => ({
        label: `Zoom: ${z}%`,
        action: () => store.getState().setZoom(z / 100)
    })),
    fontSize: [12, 14, 16, 18, 20, 22, 24, 26, 28].map(fontSize => ({
        label: `Font Size: ${fontSize}px`,
        action: () => store.getState().setFontSize(fontSize)
    })),
    editorWidth: [600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600].map(editorWidth => ({
        label: `Editor Width: ${editorWidth}px`,
        action: () => store.getState().setEditorWidth(editorWidth)
    })),
    interfaceComplexity: [
        {
            label: 'Normal',
            action: () => store.getState().setInterfaceComplexity('normal')
        },
        {
            label: 'Minimal',
            action: () => store.getState().setInterfaceComplexity('minimal')
        }
    ],
    autoSave: [0, 1000, 2000, 3000, 4000, 5000, 10000].map(period => ({
        label: period? `Auto Save: ${period / 1000}s` : 'Auto Save: off',
        action: () => store.getState().setAutoSave(period)
    }))
};
