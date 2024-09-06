import { useEffect, CSSProperties } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ImagePreview from './ImagePreview';
import LinkPreview from './LinkPreview';
import store from '../store/store';
import './Preview.css';

export default function Preview() {
    const content = store(state => state.content);
    const theme = store(state => state.settings.theme);
    const fontSize = store(state => state.settings.fontSize);
    const textAlign = store(state => state.settings.previewTextAlign);

    useEffect(() => {
        const preview = document.getElementById('preview')!;
        requestAnimationFrame(() => preview.focus());
    }, []);

    return (
        <div
            id='preview'
            style={{
                textAlign: textAlign,
                '--selection': theme.selection,
                '--primary': theme.primary,
                '--accent': theme.accent,
                '--font-size': fontSize + 'px',
                '--scrollbar-color': theme.primaryMuted
            } as CSSProperties}
            tabIndex={-1}
        >
            <Markdown
                remarkPlugins={[remarkGfm, remarkFrontmatter]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    a: ({ href, ...props }) => {
                        if (href && href.startsWith('#')) {
                            return (
                                <a href={href} {...props}>
                                    {props.children}
                                </a>
                            );
                        } else {
                            return (
                                <a {...props} target='_blank' rel='noreferrer noopener'>
                                    {props.children}
                                </a>
                            );
                        }
                    },
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
                    },
                    img: ({src, ...props}) => <ImagePreview src={src} props={props} />,
                    link: ({rel, href, ...props}) => <LinkPreview rel={rel} href={href} props={props} />
                }}
            >
                {content}
            </Markdown>
            <div style={{ height: '100%' }} />
        </div>
    );
}
