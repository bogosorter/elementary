import store from '../store/store';
import { CommandPaletteAction } from '../components/CommandPalette';


export default function makeRecentFile(path: string) {
    // TODO: find the correct filename
    const filename = path.split(/[/\\]/).pop();
    const displayPath = path.length <= 48? path : path.substring(0, 45) + '...';

    return {
        label: <><strong>{filename}</strong>&nbsp;({displayPath})</>,
        action: () => store.getState().openRecent(path)
    } as CommandPaletteAction;
}
