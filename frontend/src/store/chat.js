import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosinstance } from "../lib/axios";
import { useauthstore } from "./authStore";

export const useChat = create((set, get) => ({
  messages: [],
  users: [],
  selectuser: null,
  isuserloading: false,
  ismessagesloading: false,

  // ✅ Fetch users only if needed
  getusers: async () => {
    if (get().users.length > 0) return; // Prevent multiple calls if users exist
    set({ isuserloading: true });

    try {
      const res = await axiosinstance.get("/Messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isuserloading: false });
    }
  },

  // ✅ Fetch messages for a selected user
  getmessages: async (userid) => {
    set({ ismessagesloading: true });

    try {
      const res = await axiosinstance.get(`/Messages/${userid}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ ismessagesloading: false });
    }
  },

  sendmessages:async(messageData)=>{
   const {selectuser,messages}=get()
   try {
    const res =await axiosinstance.post(`/Messages/send/${selectuser._id}`,messageData)
    set({messages:[...messages,res.data]})
   } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch users");
   }
  },

  subscribeToMessages: () => {
    const { selectuser } = get();
    if (!selectuser) return;

    const socket = useauthstore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectuser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useauthstore.getState().socket;
    socket.off("newMessage");
  },

// todo:optimize this one later 
  setselectuser:(selectuser)=>set({selectuser}),
}))