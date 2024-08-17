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
        { icon: <PlusLg size={20} />, action: () => store.getState().newFile() },
        { icon: <Folder2Open size={20} />, action: () => store.getState().open() },
        { icon: <Floppy size={20} />, action: () => store.getState().save() },
        { icon: preview? <EyeSlash size={20} /> : <Eye size={20} />, action: () => store.getState().togglePreview() },
        { icon: <Gear size={20} />, action: () => store.getState().openCommandPalette() }
    ].map(({icon, action}, index) =>
        <button
            className='sidebar-button'
            onClick={action}
            style={{ color: theme.primary }}
            key={index}
        >
            {icon}
        </button>
    );

    const markdownButtons = [
        { icon: <TypeBold size={20} />, action: () => store.getState().bold() },
        { icon: <TypeItalic size={20} />, action: () => store.getState().italic() },
        { icon: <TypeStrikethrough size={20} />, action: () => store.getState().strikethrough() },
        { icon: <CodeSlash size={18} />, action: () => store.getState().inlineCode() },
        { icon: <Link45deg size={20} />, action: () => store.getState().link() },
        { icon: <Hash size={20} />, action: () => store.getState().heading() },
        { icon: <Quote size={20} />, action: () => store.getState().quote() },
        { icon: <ListUl size={20} />, action: () => store.getState().unorderedList() },
        { icon: <ListOl size={18} />, action: () => store.getState().orderedList() },
        { icon: <ListCheck size={16} />, action: () => store.getState().todoList() }
    ].map(({icon, action}, index) =>
        <button
            className='sidebar-button'
            onClick={action}
            style={{ color: theme.primary }}
            key={index}
        >
            {icon}
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
