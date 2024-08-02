// Defines a line used for the minimize button
export function Line({ size = 32 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            fill="currentColor"
            stroke="currentColor"
            viewBox="0 0 16 16"
            strokeWidth="1"
        >
            <line x1="2" y1="13" x2="14" y2="13" />
        </svg>
    );
}
