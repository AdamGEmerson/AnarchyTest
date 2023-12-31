'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {useEffect, useState} from "react";
import {IconBrandOpenai, IconDots, IconEdit} from "@tabler/icons-react";
import Link from "next/link";
import {useRouter} from "next/navigation";

export type Session = {
  id: string
  title: string
  user_id: string
  is_shared: boolean
  created_at: string
  model: string
}
export default function Sessions({ serverSessions}: {serverSessions: Session[]} ) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>(serverSessions);

  const fetchSessions = async () => {
    const {
      data: {user},
    } = await supabase.auth.getUser()

    if (!user) {
      console.log('no user')
      return null
    }

    const {data: sessions} = await supabase
      .from('Sessions')
      .select('*').eq('user_id', user.id).order('created_at', {ascending: false})
    return sessions
  }

  useEffect(() => {
    setSessions(serverSessions)
  }, [serverSessions])

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Sessions' }, (payload) => {
        setSessions((sessions) => [...sessions, payload.new as Session])
        console.log("NEW INSERT")
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, setSessions, sessions])

  if (sessions.length === 0) {
    fetchSessions().then((sessions) => {
      if (sessions) {
        setSessions(sessions)
      }
    })
  }

  const handleClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.log('no user')
      return null
    }

    const {data: newSession} = await supabase.from('Sessions').insert([{ title: 'New Session', user_id: user.id }]).select()
    if (newSession)
      router.push(`/c/${newSession[0].id}`)
  }

  return (
    <>
      <button onClick={handleClick} className={'flex flex-row items-center justify-between w-full hover:bg-slate-800 p-2 rounded-xl'}>
        <div className={'flex flex-row items-center gap-2'}><IconBrandOpenai size={24}/> FakeGPT</div>
        <div className={''}><IconEdit size={18}/></div>
      </button>
      <div className={'flex-1 overflow-scroll w-full'}>
        <ul className={'flex flex-col gap-2 w-full'}>
          {sessions.map((session) => (
            <div className={'flex flex-row justify-between hover:bg-zinc-800 w-full p-2 rounded-xl'} key={session.id}>
              <Link href={`/c/${session.id}`} >{session.title}</Link>
              <button onClick={() => console.log('show dropdown')}>
                <IconDots />
              </button>
            </div>
          ))}
        </ul>
      </div>
    </>
  )
}