import AuthButton from '../../components/AuthButton'
import SessionList from '../../components/SessionList'
import { cookies } from 'next/headers'
import {IconEdit, IconBrandOpenai, IconShare} from "@tabler/icons-react";
import {createClient} from "@/utils/supabase/server";
import { Session } from '@/components/SessionList'
import ChatPanel from "@/components/ChatPanel";


export default async function Index() {

  return (
    <>
      <ChatPanel sessionID={null} />
    </>
  )
}
