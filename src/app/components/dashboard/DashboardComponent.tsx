"use client"; // Esse componente será renderizado no cliente

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import { Checkbox } from "@/components/ui/checkbox";

import { PiArrowBendUpRight } from "react-icons/pi";
import { IoMdShare } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { db } from "@/services/firebaseConnection";

import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

import Link from "next/link";

import { toast } from "sonner";

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: string;
}

export default function Page() {
  const { data: session, status } = useSession();
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>();

  useEffect(() => {
    const loadTasks = async () => {
      if (!session?.user?.email) return;
      console.log(session.user.email);

      const tasksRef = collection(db, "tasks");
      const q = query(
        tasksRef,
        orderBy("created", "desc"),
        where("user", "==", session?.user?.email)
      );

      onSnapshot(q, (snapshot) => {
        let list = [] as TaskProps[];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            created: doc.data().created,
            task: doc.data().task,
            public: doc.data().public,
            user: doc.data().user,
          });
        });

        setTasks(list);
      });
    };
    loadTasks();
  }, [session?.user?.email]);

  useEffect(() => {
    // Verifica se está no cliente antes de acessar window
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Só executa se estiver no cliente
    if (typeof window !== "undefined") {
      // Define o valor inicial da largura
      setWindowWidth(window.innerWidth);

      // Adiciona o event listener para resize
      window.addEventListener("resize", handleResize);
    }

    // Remove o event listener quando o componente é desmontado
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez ao montar o componente

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  if (!session) {
    redirect("/");
  }

  const handleChangePublic = () => {
    if (!publicTask) setPublicTask(true);
    if (publicTask) setPublicTask(false);
  };

  const handleRegisterTask = async (e: FormEvent) => {
    e.preventDefault();
    if (input === "") return;

    try {
      await addDoc(collection(db, "tasks"), {
        task: input,
        created: new Date(),
        user: session.user?.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = async (taskId: string) => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${taskId}`
    );
    toast.message("Copiado com Sucesso!", {
      description: "O link da task foi copiado para sua área de transferência.",
    });
  };

  const handleDelete = async (taskId: string) => {
    const docRef = doc(db, "tasks", taskId);
    await deleteDoc(docRef);
  };

  return (
    <div
      className="text-white max-w-7xl mx-auto px-8 flex
        mt-10 flex-col gap-y-20"
    >
      <div className="max-w-3xl mx-auto w-full space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold mulish">Criar Tasks +</h2>
        <form
          className="flex flex-col gap-y-4 sm:gap-y-2"
          onSubmit={handleRegisterTask}
        >
          <div
            className="h-12 sm:h-16 flex bg-inputColor rounded px-2 sm:px-4 py-1 sm:py-2
                    items-center md:gap-x-4 border border-borderColor border-opacity-20 shadow-md"
          >
            <input
              type="text"
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              className="rounded bg-inputColor flex-1 w-[70%] h-full
                        px-2 outline-none mulish font-thin placeholder:opacity-50 sm:text-lg"
              placeholder="Ex: Estudar pela manhã..."
            />
            <button
              className="bg-buttonColor right-0 px-4 justify-center flex items-center sm:px-4 font-bold sm:font-light
                        rounded h-full outline-none mulish text-lg sm:text-sm md:w-32 hover:bg-zinc-950
                        ease-in duration-300"
            >
              {Number(windowWidth) < 640 ? "+" : "Confirmar"}
            </button>
          </div>
          <div className="flex items-center gap-x-2">
            <Checkbox
              id="terms"
              onClick={handleChangePublic}
              checked={publicTask}
              className="bg-inputColor border-borderColor border-opacity-20
                        w-5 h-5"
            />
            <label htmlFor="terms" className="mulish font-light opacity-70">
              Task Pública?
            </label>
          </div>
        </form>
      </div>
      <div className="max-w-3xl mx-auto w-full space-y-4 mb-24">
        <h2 className="text-xl sm:text-2xl font-bold mulish">Minhas Tasks</h2>
        <div className="space-y-4">
          {tasks?.map((task) => (
            <div
              key={task.id}
              className="bg-inputColor h-12 py-10 sm:h-16 rounded border border-borderColor
                    border-opacity-20 shadow-md mulish flex items-center px-4 justify-between"
            >
              <div className="flex flex-col gap-x-2">
                {task.public && (
                  <div
                    className="flex gap-x-1 opacity-20 hover:opacity-100 duration-300 cursor-pointer ease-in"
                    onClick={() => handleShare(task.id)}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <IoMdShare
                            color="#b5b5b5"
                            size={Number(windowWidth) < 638 ? "16" : "20"}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Público</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="mulish text-[#b5b5b5]">Compartilhar</p>
                  </div>
                )}
                <p className="text-[#b5b5b5] sm:text-lg font-light">
                  {task.task}
                </p>
              </div>
              <div className=" flex gap-x-4 sm:gap-x-8">
                {task.public && (
                  <Link className="flex items-center" href={`/task/${task.id}`}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <PiArrowBendUpRight
                            color="#b5b5b5"
                            size={Number(windowWidth) < 638 ? "20" : "24"}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Responder</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Link>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <FaTrashAlt
                        onClick={() => handleDelete(task.id)}
                        color="#b5b5b5"
                        size={Number(windowWidth) < 638 ? "16" : "20"}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remover</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
