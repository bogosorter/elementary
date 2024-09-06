import { useEffect, useState } from 'react';
import store from '../store/store';

export default function ImagePreview({ src, props }: { src: string | undefined, props: any }) {
    const [content, setContent] = useState<string>();

    useEffect(() => {
        if (!src || src.startsWith('http')) {
            setContent(src);
            return;
        }

        store.getState().getLocalFileBase64(src).then((result) => {
            if (!result) return;

            const { mimeType, data } = result;
            setContent(`data:${mimeType};base64,${data}`)
        });
    }, []);

    return <img src={content} {...props} />
}
