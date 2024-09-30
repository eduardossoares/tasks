import Image from "next/image";
import Icon from "../../public/assets/undraw_add_tasks_re_s5yj.svg";
import type { Metadata } from "next";

import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: 'Tasks+',
}


export default function Home() {
  return (
    <div className={"bg-zinc-950 flex flex-col items-center justify-center container mx-auto"}>
      <div className="text-white kumbh_sans flex flex-col-reverse md:flex-row max-w-7xl
      items-center px-8 sm:space-y-0 gap-x-0 md:gap-x-8 gap-y-12 md:gap-y-0">
        <div className="md:space-y-4 space-y-2 md:text-end text-center flex-1">
          <h1 className="md:text-5xl xl:text-7xl lg:text-6xl sm:text-4xl text-2xl font-extralight">
            Aumente sua produtividade conosco
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-thin">
            Planeje e priorize suas tarefas de forma simples e intuitiva.
          </p>
        </div>
        <Image
          alt="Icon"
          src={Icon}
          className="flex-1 w-64"
        />
      </div>
    </div>
  );
}
