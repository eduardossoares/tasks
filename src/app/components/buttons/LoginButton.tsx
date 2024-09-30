"use client";

import { signIn } from "next-auth/react"

export function LoginButton() {
    return (
        <button className="sm:text-lg kumbh_sans cursor-pointer hover:text-zinc-400
            duration-500" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
            Entrar
        </button>
    )
}