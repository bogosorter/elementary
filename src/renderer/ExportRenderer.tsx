import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import APreview from './components/APreview';
import CodePreview from './components/CodePreview';
import ImagePreview from './components/ImagePreview';
import LinkPreview from './components/LinkPreview';
import debounce from './utils/debounce';
import './components/Preview.css';
import './ExportRenderer.css';

let pending = 0;
const exportToPDF = debounce(() => {
    if (pending > 0) return;
    window.electron.ipcRenderer.send('exportWindowLoad');
}, 300);

export default function ExportRenderer() {
    const [path, setPath] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const exportFile = window.electron.exportFile!;
        window.electron.ipcRenderer.invoke('getFileContent', exportFile).then((data: string) => {
            setPath(exportFile);
            setContent(data);
            exportToPDF();
        });
    }, []);

    async function getLocalFileBase64(resourcePath: string) {
        return window.electron.ipcRenderer.invoke('getLocalFileBase64', path, resourcePath);
    }

    async function getLocalFile(resourcePath: string) {
        return window.electron.ipcRenderer.invoke('getLocalFile', path, resourcePath);
    }

    async function onLoadStart() {
        pending++;
    }

    async function onLoadEnd() {
        pending--;
        exportToPDF();
    }

    return (
        <Markdown
            className="markdown-body"
            remarkPlugins={[remarkGfm, remarkFrontmatter]}
            rehypePlugins={[rehypeRaw, rehypeSlug]}
            components={{
                a: ({ href, ...props }) => <APreview href={href} props={props} />,
                code: ({ children, className, ...props }) => (
                    <CodePreview
                        children={children}
                        className={className}
                        props={props}
                        theme="light"
                    />
                ),
                img: ({ src, ...props }) => (
                    <ImagePreview
                        src={src}
                        props={props}
                        getLocalFileBase64={getLocalFileBase64}
                        onLoadStart={onLoadStart}
                        onLoadEnd={onLoadEnd}
                    />
                ),
                link: ({ rel, href, ...props }) => (
                    <LinkPreview
                        rel={rel}
                        href={href}
                        props={props}
                        getLocalFile={getLocalFile}
                        onLoadStart={onLoadStart}
                        onLoadEnd={onLoadEnd}
                    />
                ),
                script: () => null
            }}
        >
            {content}
        </Markdown>
    );
}
