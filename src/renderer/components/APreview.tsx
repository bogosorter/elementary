export default function APreview({ href, props }: { href: string | undefined, props: any }) {
    if (href && href.startsWith('#')) return (
        <a href={href} {...props}>
            {props.children}
        </a>
    );

    return (
        <a href={href} {...props} target='_blank' rel='noreferrer noopener'>
            {props.children}
        </a>
    );
}
