import { useEffect, CSSProperties } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneLight, oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import store from '../store/store';
import './Preview.css';

export default function Preview() {
    const content = store(state => state.content);
    const theme = store(state => state.settings.theme);
    const fontSize = store(state => state.settings.fontSize);

    useEffect(() => {
        const preview = document.getElementById('preview')!;
        requestAnimationFrame(() => preview.focus());
    }, []);

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
            tabIndex={-1}
        >
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    a: ({ node, ...props }) => (
                        <a {...props} target='_blank' rel='noreferrer noopener'>
                            {props.children}
                        </a>
                    ),
                    code: ({children, className, node, ...rest}) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                        // @ts-ignore
                        <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            style={theme.name === 'dark' ? oneDark : oneLight}
                        />
                        ) : (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                        )
                    }
                }}
            >
                {content}
            </Markdown>
            <div style={{ height: '100%' }} />
        </div>
    );
}
