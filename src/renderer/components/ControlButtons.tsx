import { Folder2Open, Floppy, PlusLg, Gear } from 'react-bootstrap-icons';
import store from '../store/store';
import './ControlButtons.css';

export default function ControlButtons() {
    const theme = store((state) => state.settings.theme);

    return (
        <div
            id='control-buttons'
            style={{ backgroundColor: theme.surfaceVariant }}
        >
            <button
                className='control-button'
                onClick={() => store.getState().newFile()}
                style={{ color: theme.primary }}
            ><PlusLg size={20} /></button>
            <button
                className='control-button'
                onClick={() => store.getState().open()}
                style={{ color: theme.primary }}
            ><Folder2Open size={20} /></button>
            <button
                className='control-button'
                onClick={() => store.getState().save()}
                style={{ color: theme.primary }}
            ><Floppy size={20} /></button>
            <button
                className='control-button'
                onClick={() => store.getState().toggleCommandPalette()}
                style={{ color: theme.primary }}
            ><Gear size={20} /></button>
        </div>
    );
}
