import { Folder2Open, Floppy, Eye, EyeSlash, PlusLg, Gear, TypeBold, TypeItalic, TypeStrikethrough, CodeSlash, Highlighter, Link45deg, Hash, Quote, ListUl, ListOl, ListCheck } from 'react-bootstrap-icons';
import store from '../store/store';
import './Sidebar.css';

export default function Sidebar() {
    const theme = store((state) => state.settings.theme);
    const sidebar = store((state) => state.settings.sidebar);
    const preview = store((state) => state.preview);

    const showFileActions = sidebar === 'fileActions' || sidebar === 'all';
    const showMarkdownActions = (sidebar === 'markdownActions' || sidebar === 'all') && !preview;

    const fileButtons = [
        { icon: <PlusLg size={20} />, action: () => store.getState().newFile(), tooltip: 'New file' },
        { icon: <Folder2Open size={20} />, action: () => store.getState().open(), tooltip: 'Open file' },
        { icon: <Floppy size={20} />, action: () => store.getState().save(), tooltip: 'Save file' },
        { icon: preview? <EyeSlash size={20} /> : <Eye size={20} />, action: () => store.getState().togglePreview(), tooltip: 'Toggle preview' },
        { icon: <Gear size={20} />, action: () => store.getState().openCommandPalette(), tooltip: 'Command Palette' }
    ].map(({icon, action, tooltip}, index) =>
        <button
            className='sidebar-button'
            onClick={action}
            style={{ color: theme.primary }}
            key={index}
        >
            {icon}
            <div
                className='tooltip'
                style={{ backgroundColor: theme.surfaceVariant}}
            >
                {tooltip}
            </div>
        </button>
    );

    const markdownButtons = [
        { icon: <TypeBold size={20} />, action: () => store.getState().bold(), tooltip: 'Bold' },
        { icon: <TypeItalic size={20} />, action: () => store.getState().italic(), tooltip: 'Italic' },
        { icon: <TypeStrikethrough size={20} />, action: () => store.getState().strikethrough(), tooltip: 'Strikethrough' },
        { icon: <CodeSlash size={18} />, action: () => store.getState().inlineCode(), tooltip: 'Inline code' },
        { icon: <Link45deg size={20} />, action: () => store.getState().link(), tooltip: 'Link' },
        { icon: <Hash size={20} />, action: () => store.getState().heading(), tooltip: 'Heading' },
        { icon: <Quote size={20} />, action: () => store.getState().quote(), tooltip: 'Quote' },
        { icon: <ListUl size={20} />, action: () => store.getState().unorderedList(), tooltip: 'Unordered list' },
        { icon: <ListOl size={18} />, action: () => store.getState().orderedList(), tooltip: 'Ordered list' },
        { icon: <ListCheck size={16} />, action: () => store.getState().todoList(), tooltip: 'Todo list' }
    ].map(({icon, action, tooltip}, index) =>
        <button
            className='sidebar-button'
            onClick={action}
            style={{ color: theme.primary }}
            key={index}
        >
            {icon}
            <div
                className='tooltip'
                style={{ backgroundColor: theme.surfaceVariant}}
            >
                {tooltip}
            </div>
        </button>
    );

    return (
        <div className='sidebar'>
            {showFileActions &&
                <div className='sidebar-component' style={{ backgroundColor: theme.surfaceVariant }}>
                    {fileButtons}
                </div>
            }
            {showMarkdownActions &&
                <div className='sidebar-component hide-small' style={{ backgroundColor: theme.surfaceVariant }}>
                    {markdownButtons}
                </div>
            }
        </div>
    );
}
