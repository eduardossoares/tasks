"use client";

import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { GetServerSideProps } from "next";

import { db } from "@/services/firebaseConnection";
import {
  getDoc,
  doc,
  collection,
  where,
  query,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { HiArrowUturnLeft } from "react-icons/hi2";
import { FaTrashAlt } from "react-icons/fa";

interface TaskProps {
  id: string;
  task: string;
  public: boolean;
  created: string;
  user: string;
}

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  username: string;
  email: string;
}

export default function Page() {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [taskDetail, setTaskDetail] = useState<TaskProps>();

  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentProps[]>([]);

  useEffect(() => {
    const loadTaskDetails = async () => {
      const docRef = doc(db, "tasks", params.id);
      const snapshot = await getDoc(docRef);

      if (snapshot.data() === undefined) return redirect("/dashboard");
      if (snapshot.data()?.public === false) return redirect("/dashboard");

      const miliseconds = snapshot.data()?.created.seconds * 1000;

      setTaskDetail({
        id: params.id,
        task: snapshot.data()?.task,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
      });
    };
    loadTaskDetails();
  }, []);

  const loadComments = async () => {
    const q = query(
      collection(db, "comments"),
      where("taskId", "==", params.id)
    );
    const snapshotComments = await getDocs(q);
    let listComments = [] as CommentProps[];
    snapshotComments.forEach((doc) => {
      listComments.push({
        id: doc.id,
        comment: doc.data().comment,
        username: doc.data().username,
        email: doc.data().email,
        taskId: doc.data().taskId,
      });
    });
    setComments(listComments);
  };

  useEffect(() => {
    loadComments();
  }, [params.id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.length === 0) return;
    if (!session) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        username: session.user?.name,
        email: session.user?.email,
        taskId: params.id,
      });
      setInput("");
      loadComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelet = async (id: string) => {
    const docRef = doc(db, "comments", id);
    await deleteDoc(docRef);
    loadComments();
  };

  return (
    <div className="container max-w-3xl mx-auto pt-10 px-4 space-y-14">
      <div
        className="h-12 sm:h-16 flex bg-inputColor rounded px-2 sm:px-4 py-1 sm:py-2 gap-x-2
                    items-center md:gap-x-4 border border-borderColor border-opacity-20 shadow-md"
      >
        <Link href={"/dashboard"}>
          <HiArrowUturnLeft
            color="white"
            size={20}
            className="cursor-pointer"
          />
        </Link>
        <p className="text-white sm:text-lg font-light mulish">
          {taskDetail?.task}
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xl text-white mulish">Deixe seu comentário</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={input}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setInput(event.target.value)
            }
            type="text"
            className="h-12 sm:h-16 flex bg-inputColor rounded px-2 sm:px-4 py-1 sm:py-2
                    items-center md:gap-x-4 border border-borderColor border-opacity-20 shadow-md outline-none
                    w-full mulish font-thin placeholder:opacity-50 sm:text-lg text-white"
            placeholder="Ex: Ótima task!"
            disabled={session ? false : true}
          />
          <button
            className={`${
              session ? "text-base" : "text-sm font-normal"
            } bg-opacity-0 justify-center flex items-center font-bold sm:font-semibold
                        rounded h-14 outline-none mulish sm:text-base w-full
                        ease-in duration-300 text-white border border-borderColor border-opacity-20
                        hover:border-opacity-45`}
            disabled={session ? false : true}
          >
            {session
              ? "Enviar Comentário"
              : "Efetue Login para Realizar um Comentário"}
          </button>
        </form>
      </div>
      <div className="space-y-4 pb-10">
        <p className="text-xl text-white mulish">Todos os Comentários</p>

        {comments.map((item) => (
          <div
            className="h-auto justify-between items-center flex flex-row bg-inputColor rounded px-6 py-4 sm:py-4 gap-x-2
            md:gap-x-4 border border-borderColor border-opacity-20 shadow-md"
            key={item.id}
          >
            <div className="flex-1 break-all">
              <span className="text-white text-sm">{item.username}</span>
              <p className="text-[#b5b5b5] sm:text-lg font-light mulish">
                {item.comment}
              </p>
            </div>
            {item.email === session?.user?.email && (
              <FaTrashAlt
                onClick={() => handleDelet(item.id)}
                size={24}
                color="white"
                className="cursor-pointer w-5 sm:w-auto"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
