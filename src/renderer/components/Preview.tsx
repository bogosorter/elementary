import { useEffect, CSSProperties } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeRaw from 'rehype-raw';
import APreview from './APreview';
import CodePreview from './CodePreview';
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
                    a: ({href, ...props}) => <APreview href={href} props={props} />,
                    code: ({children, className, ...props}) => <CodePreview children={children} className={className} props={props} />,
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
