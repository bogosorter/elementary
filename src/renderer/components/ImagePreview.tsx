import { useEffect, useState } from 'react';

type LocalFileBase64Getter = (path: string) => Promise<{
    mimeType: string;
    data: string;
} | null>;

export default function ImagePreview({ src, props, getLocalFileBase64, onLoadStart, onLoadEnd }: { src: string | undefined, props: any, getLocalFileBase64: LocalFileBase64Getter, onLoadStart?: () => void, onLoadEnd?: () => void }) {
    const [content, setContent] = useState<string>();

    useEffect(() => {
        if (!src || src.startsWith('http')) return;

        if (onLoadStart) onLoadStart();
        getLocalFileBase64(src).then((result) => {
            if (!result) return;

            const { mimeType, data } = result;
            setContent(`data:${mimeType};base64,${data}`)
        });
    }, [src, getLocalFileBase64, onLoadStart, onLoadEnd]);

    useEffect(() => {
        if (content && onLoadEnd) onLoadEnd();
    }, [content]);

    if (content) return <img src={content} {...props} />
    return <img src={src} {...props} />
}
