import { CSSProperties } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import store from '../store/store';
import './Preview.css';

export default function Preview() {
    const content = store(state => state.content);
    const theme = store(state => state.settings.theme);
    const fontSize = store(state => state.settings.fontSize);

    return (
        <div
            id='preview'
            style={{
                '--selection': theme.selection,
                '--primary': theme.primary,
                '--accent': theme.accent,
                '--font-size': fontSize + 'px',
                '--scrollbar-color': theme.primaryMuted
            } as CSSProperties}
        >
            <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                    'a': ({ node, ...props }) => (
                        <a {...props} target='_blank' rel='noreferrer noopener'>
                            {props.children}
                        </a>
                    )
                }}
            >
                {content}
            </Markdown>
            <div style={{ height: '100%' }} />
        </div>
    );
}
