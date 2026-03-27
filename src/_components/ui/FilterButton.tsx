export default function FilterButton({
    label,
    active,
    onClick
}: {
    label: string
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 border-2 rounded-xl transition-normal cursor-pointer ${
                active
                    ? "bg-[var(--white-border)]/20 border-[var(--white-border-hover)]"
                    : "border-[var(--white-border)] hover:bg-[var(--white-border)]/10"
            }`}
        >
            <div className={`relative size-[16px]`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${active ? "opacity-0 rotate-45" : "opacity-100 rotate-0"}`}>
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${active ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`}>
                    <path d="M20 6 9 17l-5-5"/>
                </svg>
            </div>

            {label}
        </button>
    )
}