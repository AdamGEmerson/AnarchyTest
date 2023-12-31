"use client";

import { IconArrowUp, IconShare } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Message from "@/components/Message";
import ShareModal from "@/components/ShareModal";

export type MessageType = {
  id: string;
  text: string;
  user_id: string;
  session_id: string;
  is_response: boolean;
  created_at: string;
};

export default function ChatPanel({ sessionID }: { sessionID: string | null }) {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const ref = useRef(null);
  const [modal, setModal] = useState(false);

  const onModalClose = () => setModal(false);
  const onModalOpen = () => setModal(true);

  const fetchMessages = async () => {
    const { data: messages } = await supabase
      .from("Message")
      .select("*")
      .eq("session_id", sessionID)
      .order("created_at", { ascending: true });
    return messages;
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("*")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Message" },
        (payload) => {
          console.log("New Message");
          setMessages((messages) => [...messages, payload.new as MessageType]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setMessages, messages]);

  useEffect(() => {
    if (sessionID && messages.length === 0) {
      fetchMessages().then((messages) => {
        if (messages) {
          setMessages(messages);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  function generateRandomChars() {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let spaceProbability = 0.1; // initial probability of adding a space

    for (let i = 0; i < 200; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));

      // If a random number is less than the current probability, add a space
      if (Math.random() < spaceProbability) {
        result += " ";
        spaceProbability = 0.1; // reset the probability
      } else {
        spaceProbability += 0.1; // increase the probability
      }
    }
    return result;
  }

  const generateResponse = () => {
    const response = generateRandomChars();
    supabase
      .from("Message")
      .insert({
        text: response,
        session_id: sessionID,
        is_response: true,
        user_id: user.id,
      })
      .then((res) => {
        console.log(res);
      });
  };
  const handleSubmit = () => {
    console.log(input);
    setInput("");
    supabase
      .from("Message")
      .insert({
        text: input,
        session_id: sessionID,
        is_response: false,
        user_id: user.id,
      })
      .then((res) => {
        console.log(res);
        generateResponse();
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-8 items-center justify-around h-screen p-8 bg-zinc-700">
      {sessionID && (
        <ShareModal
          isOpen={modal}
          onClose={onModalClose}
          sessionId={sessionID}
        />
      )}
      <div className={"flex flex-row justify-between w-full"}>
        {/*  Dropdown menu */}
        <select
          defaultValue={"gpt-4"}
          className={"bg-zinc-700 rounded hover:bg-zinc-500 p-2"}
        >
          <option value="gpt-4">ChatGPT 4</option>
          <option value="gpt-3.5">ChatGPT 3.5</option>
        </select>
        {sessionID && (
          <button
            className={"bg-zinc-700 hover:bg-zinc-500 p-2 rounded-xl"}
            onClick={onModalOpen}
          >
            <IconShare size={18} />
          </button>
        )}
      </div>
      {sessionID ? sessionID : "No session selected"}
      <div className={"flex-1 px-32 overflow-scroll gap-2 flex flex-col"}>
        {messages.map((message) => (
          <Message message={message} key={message.id} />
        ))}
        <div style={{ float: "left", clear: "both" }} ref={ref} />
      </div>
      <div className={"flex flex-row w-full ring-1 ring-zinc-500 rounded-xl"}>
        <input
          className={
            "w-full p-4 bg-transparent focus:ring-0 focus:ring-offset-0 outline-none"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={
            "bg-white hover:bg-zinc-800 ring-1 ring-white p-2 rounded-xl m-2"
          }
          onClick={handleSubmit}
        >
          <IconArrowUp color={"black"} />
        </button>
      </div>
    </div>
  );
}
