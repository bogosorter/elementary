import { Folder2Open, Floppy, PlusLg, Gear, TypeBold, TypeItalic, TypeStrikethrough, CodeSlash, Highlighter, Link45deg } from 'react-bootstrap-icons';
import store from '../store/store';
import './Sidebar.css';

export default function Sidebar() {
    const theme = store((state) => state.settings.theme);

    const fileButtons = [
        { icon: <PlusLg size={20} />, action: () => store.getState().newFile() },
        { icon: <Folder2Open size={20} />, action: () => store.getState().open() },
        { icon: <Floppy size={20} />, action: () => store.getState().save() },
        { icon: <Gear size={20} />, action: () => store.getState().toggleCommandPalette() }
    ].map(({icon, action}) =>
        <button
            className='sidebar-button'
            onClick={action}
            style={{ color: theme.primary }}
        >
            {icon}
        </button>
    );

    const markdownButtons = [
        { icon: <TypeBold size={20} />, action: () => store.getState().bold() },
        { icon: <TypeItalic size={20} />, action: () => store.getState().italic() },
        { icon: <TypeStrikethrough size={20} />, action: () => store.getState().strikeThrough() },
        { icon: <CodeSlash size={18} />, action: () => store.getState().inlineCode() },
        { icon: <Highlighter size={16} />, action: () => store.getState().highlight() },
        { icon: <Link45deg size={20} />, action: () => store.getState().link() }
    ].map(({icon, action}) =>
        <button
            className='sidebar-button'
            onClick={action}
            style={{ color: theme.primary }}
        >
            {icon}
        </button>
    );

    return (
        <div id='sidebar'>
            <div className='sidebar-component' style={{ backgroundColor: theme.surfaceVariant }}>
                {fileButtons}
            </div>
            <div className='sidebar-component' style={{ backgroundColor: theme.surfaceVariant }}>
                {markdownButtons}
            </div>
        </div>
    );
}
