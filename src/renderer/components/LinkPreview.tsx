import { useEffect, useState } from 'react';

type LinkPreviewArguments = {
    rel?: string;
    href?: string;
    props?: any;
    getLocalFile: (path: string) => Promise<string | null>;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
};

export default function LinkPreview({ rel, href, props, getLocalFile, onLoadStart, onLoadEnd }: LinkPreviewArguments) {
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
