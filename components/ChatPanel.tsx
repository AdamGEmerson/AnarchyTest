'use client'

import {
  IconArrowUp, IconBrandOpenai,
  IconClipboard,
  IconReload,
  IconShare,
  IconThumbDown,
  IconThumbUp,
  IconUser
} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Session} from "@/components/SessionList";

export type Message = {
  id: string
  text: string
  user_id: string
  session_id: string
  is_response: boolean
  created_at: string
}

export default function ChatPanel({sessionID}: {sessionID: string | null}) {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const ref = useRef(null);

  const fetchMessages = async () => {
    const {data: messages} = await supabase
      .from('Message')
      .select('*').eq('session_id', sessionID).order('created_at', {ascending: true})
    return messages
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Message' }, (payload) => {
        console.log("New Message")
        setMessages((messages) => [...messages, payload.new as Message])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, setMessages, messages])

  useEffect(() => {
    if (sessionID && messages.length === 0) {
      fetchMessages().then((messages) => {
        if (messages) {
          setMessages(messages)
        }
      })
    }
  }, []);

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  function generateRandomChars() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let spaceProbability = 0.1; // initial probability of adding a space

    for (let i = 0; i < 200; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));

      // If a random number is less than the current probability, add a space
      if (Math.random() < spaceProbability) {
        result += ' ';
        spaceProbability = 0.1; // reset the probability
      } else {
        spaceProbability += 0.1; // increase the probability
      }
    }
    return result;
  }

  const generateResponse = () => {
    const response = generateRandomChars()
    supabase.from('Message').insert({text: response, session_id: sessionID, is_response: true, user_id: user.id}).then((res) => {
      console.log(res)
    })
  }
  const handleSubmit = () => {
    console.log(input)
    setInput('')
    supabase.from('Message').insert({text: input, session_id: sessionID, is_response: false, user_id: user.id}).then((res) => {
      console.log(res)
      generateResponse()
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-8 items-center justify-around h-screen p-8 bg-zinc-700">
      <div className={"flex flex-row justify-between w-full"}>
        {/*  Dropdown menu */}
        <select defaultValue={'gpt-4'} className={'bg-zinc-700 rounded hover:bg-zinc-500 p-2'}>
          <option value="gpt-4">ChatGPT 4</option>
          <option value="gpt-3.5">ChatGPT 3.5</option>
        </select>
        <form>
          <button className={'bg-zinc-700 hover:bg-zinc-500 p-2 rounded-xl'}><IconShare size={18} /></button>
        </form>
      </div>
      {sessionID ? sessionID : 'No session selected'}
      <div className={'flex-1 px-32 overflow-scroll gap-2 flex flex-col'}>
        {messages.map((message) => (
          <div className={`flex flex-col ${message.is_response ? 'justify-end' : 'justify-start'}`} key={message.id}>
            <div className={'flex flex-row justify-start w-full items-center gap-2'}>
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${message.is_response ? 'bg-purple-500' : 'bg-teal-500'}`}>
                {message.is_response ?
                <IconBrandOpenai size={16}/> :
                <IconUser size={16}/>
                }
              </div>
              <div className={'font-bold'}>{message.is_response ? 'ChatGPT' : 'You'}</div>
            </div>
            <div className={`flex rounded-xl p-2 w-11/12 break-all`}>{message.text}</div>
            {message.is_response ?
              <div className={'flex flex-row gap-2 p-2'}>
                <IconClipboard size={16}/> <IconThumbUp size={16} /> <IconThumbDown size={16}/> <IconReload size={16}/>
              </div>
              : null}
          </div>
        ))}
        <div style={{ float:"left", clear: "both" }} ref={ref}/>
      </div>
      <div className={'flex flex-row w-full ring-1 ring-zinc-500 rounded-xl'}>
      <input className={'w-full p-4 bg-transparent focus:ring-0 focus:ring-offset-0 outline-none'}
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={handleKeyDown}
      />
      <button
        className={'bg-white hover:bg-zinc-800 ring-1 ring-white p-2 rounded-xl m-2'}
        onClick={handleSubmit}
      >
        <IconArrowUp color={'black'}/>
      </button>
      </div>
    </div>
  );
}
