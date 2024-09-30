"use client";

import Image from "next/image";
import logo from "../../../public/assets/logo-white.svg";
import Link from "next/link";
import { LoginButton } from "./buttons/LoginButton";

import { useSession } from "next-auth/react";
import { LogoutButton } from "./buttons/LogoutButton";

export function Header() {
    const { data: session } = useSession();

    return (
        <header className="text-white top-0 max-w-7xl flex mx-auto
        items-center justify-between h-20 px-8 w-full z-50">
            <div className="flex items-center gap-x-20">
                <Link href={session ? "/dashboard" : "/"}>
                    <Image
                        alt="tasks+"
                        src={logo}
                        className="w-20 sm:w-24"
                    />
                </Link>
            </div>
            <div className="space-x-20">
                {session && (
                    <span className="font-thin kumbh_sans sm:text-lg hidden sm:inline">
                        Olá, {" "}
                        <span className="font-light">
                            {session?.user?.name}
                        </span>
                    </span>
                )}
                {!session ? <LoginButton /> : <LogoutButton />}
            </div>
        </header>
    )
}