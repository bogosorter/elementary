import { useEffect, useState } from 'react';
import store from '../store/store';

export default function LinkPreview({ rel, href, props }: { rel: string | undefined, href: string | undefined, props: any }) {

    const [content, setContent] = useState<string>();

    useEffect(() => {
        if (!rel || !href || href.startsWith('http')) return;

        store.getState().getLocalFile(href).then((result) => {
            if (result) setContent(result);
        });
    }, []);

    if (!rel || !content || rel !== 'stylesheet') return <link rel={rel} href={href} {...props} />
    return <style>{content}</style>
}
