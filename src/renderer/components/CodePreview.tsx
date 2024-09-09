import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import store from '../store/store';

export default function CodePreview({ children, className, props }: { children: React.ReactNode, className: string | undefined, props: any }) {
    const theme = store(store => store.settings.theme.name);
    const match = /language-(\w+)/.exec(className || '');

    if (match) return (
        <SyntaxHighlighter
            {...props}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={theme === 'dark' ? oneDark : oneLight}
        />
    );

    return (
        <code {...props} className={className}>
            {children}
        </code>
    )
}
