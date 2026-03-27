import Link from "next/link"

export default function Car() {
    return (
        <div className="flex flex-row items-center justify-between gap-3">
            <div>
                <h1>Conheça o Novo Jetta</h1>
                <h2>O sedan à altura da sua história</h2>
            </div>
            <Link href="build-your-model/setting" className="px-3 py-1 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-xl transition-normal active:95">
                Tenho Interesse
            </Link>
        </div>
    )
}