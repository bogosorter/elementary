import { useEffect, useState } from 'react';
import store from '../store/store';

type LocalFileGetter = (path: string) => Promise<string | null>;

export default function LinkPreview({ rel, href, props, getLocalFile, onLoadStart, onLoadEnd }: { rel: string | undefined, href: string | undefined, props: any, getLocalFile: LocalFileGetter, onLoadStart?: () => void, onLoadEnd?: () => void }) {
    const [content, setContent] = useState<string>();

    useEffect(() => {
        if (!rel || !href || href.startsWith('http')) return;

        if (onLoadStart) onLoadStart();
        getLocalFile(href).then((result) => {
            if (result) setContent(result);
        });
    }, [rel, href, getLocalFile, onLoadStart, onLoadEnd]);

    useEffect(() => {
        if (content && onLoadEnd) onLoadEnd();
    }, [content]);

    if (!rel || !content || rel !== 'stylesheet') return <link rel={rel} href={href} {...props} />
    return <style>{content}</style>
}
