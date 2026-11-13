import type { ReactNode } from "react";

type Props = { name: string; onClose(): void; children: ReactNode };

export function Drawer({ name, onClose, children }: Props) {
    return (
        <aside className="drawer" aria-label={name}>
            <header className="drawer-head">
                <h2>{name}</h2>
                <button
                    className="ui icon"
                    aria-label="Close"
                    title="Close (Esc)"
                    onClick={onClose}
                >
                    ×
                </button>
            </header>
            <div className="drawer-body">{children}</div>
        </aside>
    );
}
