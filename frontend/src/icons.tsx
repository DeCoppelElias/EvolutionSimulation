const box = { width: 18, height: 18, viewBox: "0 0 18 18", "aria-hidden": true } as const;

export function PlayIcon() {
    return (
        <svg {...box}>
            <path d="M4 2l12 7-12 7z" fill="currentColor" />
        </svg>
    );
}

export function PauseIcon() {
    return (
        <svg {...box}>
            <rect x="3" y="2" width="4" height="14" fill="currentColor" />
            <rect x="11" y="2" width="4" height="14" fill="currentColor" />
        </svg>
    );
}

export function StepIcon() {
    return (
        <svg {...box}>
            <path d="M3 2l9 7-9 7z" fill="currentColor" />
            <rect x="13" y="2" width="3" height="14" fill="currentColor" />
        </svg>
    );
}

export function FastForwardIcon() {
    return (
        <svg {...box}>
            <path d="M1 3l8 6-8 6zM9 3l8 6-8 6z" fill="currentColor" />
        </svg>
    );
}

export function MoonIcon() {
    return (
        <svg {...box}>
            <path d="M12 2a7 7 0 1 0 4 12A6 6 0 0 1 12 2z" fill="currentColor" />
        </svg>
    );
}

export function SunIcon() {
    return (
        <svg {...box}>
            <circle cx="9" cy="9" r="4" fill="currentColor" />
            <path
                d="M9 0v3M9 15v3M0 9h3M15 9h3M2.6 2.6l2 2M13.4 13.4l2 2M2.6 15.4l2-2M13.4 4.6l2-2"
                stroke="currentColor"
                strokeWidth="2"
            />
        </svg>
    );
}

export function MenuIcon() {
    return (
        <svg {...box}>
            <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}
