import {
  IconBrandOpenai,
  IconClipboard,
  IconReload,
  IconThumbDown,
  IconThumbUp,
  IconUser,
} from "@tabler/icons-react";
import { MessageType as MessageType } from "@/components/ChatPanel";
interface MessageInterface {
  message: MessageType;
}
export default function Message({ message }: MessageInterface) {
  return (
    <div
      className={`flex flex-col w-full ${
        message.is_response ? "justify-end" : "justify-start"
      }`}
      key={message.id}
    >
      <div className={"flex flex-row justify-start w-full items-center gap-2"}>
        <div
          className={`flex items-center justify-center w-6 h-6 rounded-full ${
            message.is_response ? "bg-purple-500" : "bg-teal-500"
          }`}
        >
          {message.is_response ? (
            <IconBrandOpenai size={16} />
          ) : (
            <IconUser size={16} />
          )}
        </div>
        <div className={"font-bold"}>
          {message.is_response ? "ChatGPT" : "You"}
        </div>
      </div>
      <div className={`flex rounded-xl p-2 w-11/12 break-all`}>
        {message.text}
      </div>
      {message.is_response ? (
        <div className={"flex flex-row gap-2 p-2"}>
          <IconClipboard size={16} /> <IconThumbUp size={16} />{" "}
          <IconThumbDown size={16} /> <IconReload size={16} />
        </div>
      ) : null}
    </div>
  );
}
