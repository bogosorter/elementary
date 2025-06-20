import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodePreview({ children, className, props, theme }: { children: React.ReactNode, className: string | undefined, props: any, theme: string }) {
    const match = /language-(\w+)/.exec(className || '');

    if (match) return (
        <SyntaxHighlighter
            {...props}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={theme === 'dark' ? oneDark : oneLight}
            customStyle={{
                padding: 0,
                backgroundColor: 'transparent',
            }}
        />
    );

    return (
        <code {...props} className={className}>
            {children}
        </code>
    )
}
