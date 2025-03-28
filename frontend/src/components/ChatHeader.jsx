import { X } from "lucide-react";
import { useauthstore } from "../store/authStore";
import { useChat } from "../store/chat";

const ChatHeader = () => {
  const{ selectuser, setselectuser} = useChat(); // ✅ Fix: Proper state initialization
  const online = useauthstore((state) => state.online); // ✅ Fix: Correct Zustand store access

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectuser?.profilepic || "/avatar.png"} // ✅ Fix: Optional chaining
                alt={selectuser?.name || "User"} // ✅ Fix: Default alt text
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectuser?.name || "Unknown User"}</h3>
            <p className="text-sm text-base-content/70">
              {selectuser?._id && online.includes(selectuser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setselectuser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
