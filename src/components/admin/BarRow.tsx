export function BarRow({label, pct, value, color}: { label: string; pct: number; value: string; color?: string }) {
    return (
        <div className="bar-row">
            <span><strong>{label}</strong></span>
            <div className="bar-track">
                <div className="bar-fill" style={{width: `${Math.min(100, pct)}%`, background: color}}/>
            </div>
            <span>{value}</span>
        </div>
    );
}
