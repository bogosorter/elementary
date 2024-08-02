import { Line } from './Line';
import { Square, XLg } from 'react-bootstrap-icons';
import store from '../store/store';
import './Header.css';

export default function Header() {

    const path = store(state => state.path) || 'Untitled';
    const saved = store(state => state.saved);
    const theme = store(state => state.settings.theme);
    const fullscreen = store(state => state.fullscreen);
    const interfaceMinimal = store(state => state.settings.interfaceComplexity) == 'minimal';
    const showHeaderButtons = !fullscreen && !interfaceMinimal;

    // Split the path into its segments and interleave them with separators
    const interleaved = interleave(splitPath(path), null);
    const pathElements = interleaved.map((item, index) => {
        if (!item) return <span className='path-separator' key={index}>&gt;</span>;
        return <span className='path-segment' key={index}>{item}</span>;
    })

    return (
        <div id='header' style={{ color: theme.primary }}>
            {showHeaderButtons && <div id='header-buttons-placeholder' />}
            <div id='path'>
                {pathElements}
                {!saved && <span id='unsaved' style={{ backgroundColor: theme.accent }}></span>}
            </div>
            {showHeaderButtons && <div id='header-buttons'>
                <button
                    className='header-button'
                    onClick={() => window.electron.ipcRenderer.send('window', 'minimize')}
                    style={{ color: theme.primary }}
                ><Line size={16} /></button>
                <button
                    className='header-button'
                    onClick={() => window.electron.ipcRenderer.send('window', 'toggle')}
                    style={{ color: theme.primary }}
                ><Square size={13} /></button>
                <button
                    className='header-button'
                    onClick={() => store.getState().onClose()}
                    style={{ color: theme.primary }}
                ><XLg  size={16}/></button>
            </div>}
        </div>
    )
}

function splitPath(path: string) {
    const isWindows = path.includes('\\');
    const delimiter = isWindows ? '\\' : '/';
    return path.split(delimiter).filter(i => i.length);
}

// https://stackoverflow.com/questions/31879576/what-is-the-most-elegant-way-to-insert-objects-between-array-elements
const interleave = <T, U>(arr: T[], thing: U): (T | U)[] => ([] as (T | U)[]).concat(...arr.map(n => [n, thing])).slice(0, -1)
