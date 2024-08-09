import store from '../store/store'
import './Footer.css';

export default function Footer() {
    const wordCount = store(state => state.wordCount);
    const characterCount = store(state => state.characterCount);
    const interfaceComplexity = store(state => state.settings.interfaceComplexity);

    const wordString = wordCount === 1 ? 'word' : 'words';
    const characterString = characterCount === 1 ? 'character' : 'characters';

    return (
        <div id='footer'>
            {interfaceComplexity === 'normal' && `${wordCount} ${wordString} · ${characterCount} ${characterString}`}
        </div>
    )
}
