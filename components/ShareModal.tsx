import { IconShare, IconShareOff, IconX } from "@tabler/icons-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

function ShareModal({ isOpen, onClose, sessionId }: ShareModalProps) {
  if (!isOpen) return null;

  const supabase = createClientComponentClient();
  const handleShare = async (share: boolean) => {
    console.log("Share");
    const { data, error } = await supabase
      .from("Session")
      .update({ is_public: share })
      .eq("id", sessionId);
    if (error) {
      console.log(error);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded shadow-lg flex flex-col gap-4">
        {/* Your modal content goes here */}
        <div className={"flex justify-between"}>
          <div className={"text-xl font-bold flex flex-row gap-2"}>
            <IconShare /> Share
          </div>
          <button onClick={onClose}>
            <IconX />
          </button>
        </div>

        <div>
          Do you want to share this chat publicly? Anyone with the link will be
          able to access it.
        </div>
        <div className={"flex gap-4"}>
          <button
            className="bg-teal-500 hover:bg-teal-400 rounded-md px-4 py-2 text-foreground mb-2 w-full flex flex-row gap-2 justify-center"
            onClick={() => handleShare(true)}
          >
            <IconShare /> Share
          </button>
          <button
            className="bg-red-400 hover:bg-red-300 rounded-md px-4 py-2 text-foreground mb-2 w-full flex flex-row gap-2 justify-center"
            onClick={() => handleShare(false)}
          >
            <IconShareOff /> Don't Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
