"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <button className="sm:text-lg kumbh_sans cursor-pointer hover:text-zinc-400
            duration-500" onClick={() => signOut()}>
            Sair
        </button>
    )
}