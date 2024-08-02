export type Shortcuts = { [key: string]: () => void };

export default function handleShortcut(e: React.KeyboardEvent<HTMLDivElement>, shortcuts: Shortcuts) {
    const ctrl = (e.ctrlKey || e.metaKey)? 'ctrl+' : '';
    const shift = e.shiftKey? 'shift+' : '';
    const alt = e.altKey? 'alt+' : '';
    const key = ctrl + shift + alt + e.key.toLowerCase();

    if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
    }
}
