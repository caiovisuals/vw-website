"use client"

import { Dispatch, SetStateAction } from "react"

interface ShowPasswordProps {
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}

export default function ShowPassword({ show, setShow }: ShowPasswordProps) {
    return (
        <button
            type="button"
            onClick={() => setShow(prev => !prev)}
            aria-pressed={show}
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-2.5 top-2.5 flex items-center justify-center bg-transparent outline-none"
            tabIndex={-1}
        >
            <svg
                viewBox="0 0 24 24"
                width={24}
                height={24}
                fill="none"
                stroke="var(--black-text)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {show ? (
                    <>
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                        <circle cx="12" cy="12" r="3"/>
                    </>
                ) : (
                    <>
                        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
                        <path d="m2 2 20 20"/>
                    </>
                )}
            </svg>
        </button>
    )
}