"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getTodo } from "@/api/todoApi";
import { TodoType } from "@/types/userTypes";
import { addNote, editNote, getNote } from "@/api/noteApi";
import { NoteType } from "@/types/apiTypes";
import Image from "next/image";
import LoadingScreen from "@/components/Loading";

export default function Note() {
  // const todoId = params.noteID;
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const goalId = Number(searchParams.get("goalId"));
  const todoId = Number(pathName.split("/").pop());
  const [todo, setTodo] = useState<TodoType>();
  const [noteDetail, setNoteDetail] = useState<NoteType>();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [link, setLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetail = async () => {
    const response = await getTodo(goalId, undefined, 9999);
    if (response) {
      // console.log(response);
      const thisTodo = response.data.todos.find(
        (todo: TodoType) => todo.id === todoId
      );
      setTodo(thisTodo);
      if (thisTodo.noteId) {
        const noteResponse = await getNote(thisTodo.noteId);
        setNoteDetail(noteResponse?.data);
        setText(noteResponse?.data.content);
        setTitle(noteResponse?.data.title);
        setLink(noteResponse?.data.linkUrl);
        console.log(noteResponse);
      }
      setIsLoading(false);
    }
  };

  const handleSubmit = async (type: string) => {
    if (type === "create") {
      const response = await addNote(todoId, title, text, link ? link : null);
      if (response) {
        alert("작성완료");
        setNoteDetail(response.data);
        console.log(response);
      }
    } else {
      const response = await editNote(
        Number(noteDetail?.id),
        title,
        text,
        link ? link : null
      );
      if (response) {
        alert("수정완료");
        setNoteDetail(response.data);
        console.log(response);
      }
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <p></p>
      <main className="w-full h-[calc(100vh-51px)] lg:h-screen bg-white mt-[51px] lg:mt-0">
        <div className="w-[343px] sm:w-full 2xl:w-[1200px] h-[calc(100vh-40px)] mx-auto p-[24px] ">
          <div className="mb-[24px] flex justify-between items-center">
            <h2 className=" text-[1.8rem] font-semibold">노트 작성</h2>
            <div className="flex items-center gap-[31px] text-[1.4rem]">
              <h6 className="text-[#3B82F6] cursor-pointer">임시저장</h6>
              <h6
                className={`px-[24px] py-[12px] text-white rounded-[12px] cursor-pointer ${
                  title && text ? "bg-[#3B82F6]" : "bg-[#94A3B8] cursor-default"
                }`}
                onClick={() =>
                  title && text && noteDetail
                    ? handleSubmit("edit")
                    : handleSubmit("create")
                }
              >
                {noteDetail ? "수정하기" : "작성 완료"}
              </h6>
            </div>
          </div>
          <div className="mb-[12px] flex gap-[6px] items-center">
            <div className="w-[24px] h-[24px] bg-[#1E293B] rounded-[6px] flex justify-center items-center">
              <Image
                src="/goal-flag.svg"
                width={16}
                height={16}
                alt="recent-task-icon"
              />
            </div>
            <h1 className="font-medium">{todo?.goal.title}</h1>
          </div>
          <div className="mb-[24px] flex gap-[8px] items-center">
            <h2 className="px-[3px] py-[2px] bg-[#f1f5f9] rounded-[4px] text-[1.2rem]">
              {todo?.done ? "Done" : "To do"}
            </h2>
            <h2 className="text-[1.4rem]">{todo?.title}</h2>
          </div>
          <input
            value={title}
            type="text"
            placeholder="노트의 제목을 입력해주세요"
            className="w-full mb-[12px] py-[12px] border-y focus:outline-none text-[1.8rem]"
            onChange={(e) => setTitle(e.target.value)}
          />
          <h2 className="mb-[8px] text-[1.2rem] font-medium">{`공백포함 : 총 ${
            text.length
          }자 | 공백제외 : 총 ${text.replace(/\s+/g, "").length}자`}</h2>
          {link && (
            <div className="w-full mt-[12px] mb-[16px] px-[6px] py-[4px] flex justify-between bg-[#E2E8F0] rounded-[20px]">
              <div className="flex gap-[8px] items-center">
                <Image
                  src="/note-embed.svg"
                  width={24}
                  height={24}
                  alt="embed-icon"
                />
                <p className="cursor-pointer hover:underline">{link}</p>
              </div>
              <Image
                className="cursor-pointer"
                src="/note-delete.svg"
                width={18}
                height={18}
                alt="delete-icon"
                onClick={() => setLink("")}
              />
            </div>
          )}
          <textarea
            value={text}
            placeholder="이 곳을 클릭해 노트 작성을 시작해주세요"
            className="w-full min-h-[600px] overflow-y-auto focus:outline-none"
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </main>
    </div>
  );
}