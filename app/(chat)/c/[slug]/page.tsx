import ChatPanel from "@/components/ChatPanel";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <ChatPanel sessionID={params.slug} />
    </>
  );
}
