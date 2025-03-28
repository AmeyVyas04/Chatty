import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useChat } from "../store/chat";

import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { useauthstore } from "../store/authStore";

const Sidebar = () => {
  const { getusers, users = [], selectuser, setselectuser, isuserloading } = useChat();
  const { online = [] } = useauthstore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    if (getusers) {
      console.log("Fetching users...");
      getusers();
    }
  }, [getusers]);

  console.log("All users from Zustand:", users);
  console.log("Online users:", online);

  const filteredUsers = showOnlineOnly
    ? users?.filter((user) => online.includes(user._id)) ?? []
    : users ?? [];

  console.log("Filtered users (based on checkbox):", filteredUsers);

  if (isuserloading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({Math.max(online.length - 1, 0)} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setselectuser(user)}
              className={`w-full p-3 flex items-center gap-3 
              hover:bg-base-300 transition-colors
              ${selectuser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {online.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.name}</div>
                <div className="text-sm text-zinc-400">
                  {online.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">
            {showOnlineOnly ? "No online users" : "No users available"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
