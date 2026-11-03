type Props = { text: string; onClose(): void };

export function Notice({ text, onClose }: Props) {
    return (
        <div className="notice" role="alert">
            <span>{text}</span>
            <button className="ui icon" aria-label="Close" onClick={onClose}>
                ×
            </button>
        </div>
    );
}
