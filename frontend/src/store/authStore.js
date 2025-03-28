
import {create} from "zustand"
import { axiosinstance } from "../lib/axios.js"
// similer to flash messages but even better
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";



const baseurl =  "http://localhost:5050/";


export const useauthstore = create((set,get) => ({
  authuser: JSON.parse(localStorage.getItem("authuser")) || null,
    issignup: false,
    isupdateprofile:false,
    islogin: false,
    ischeckauth: true,
    online: [],
    socket: null,

// signup: async (data) => {
//         set({ issignup: true });

//         try {
//             const res = await toast.promise(
//                 axiosinstance.post("/auth/signup", data), 
//                 {
//                     loading: "Saving...",
//                     success: "Signup successful!",
//                     error: "Signup failed! Please try again.",
//                 }
//             );

//             set({ authuser: res.data }); // ✅ Store user data if successful
//             return true; // ✅ Indicate success
//         } catch (error) {
//             console.log("Signup Error:", error);
//             return false; // ❌ Indicate failure
//         } finally {
//             set({ issignup: false });
//         }
//     },


checkAuth: async () => {
  try {
      const res = await axiosinstance.get("/auth/check"); // ✅ Get latest user data
      set({ authuser: res.data });
      get().connectsocket()

      // ✅ Update localStorage with latest data
      localStorage.setItem("authuser", JSON.stringify(res.data));
  } catch (error) {
      console.log("Auth check failed:", error);
      set({ authuser: null });
      localStorage.removeItem("authuser");
  } finally {
      set({ ischeckauth: false });
  }
},
signup: async (data, navigate) => {
  set({ issignup: true });

  try {
      const res = await toast.promise(
          axiosinstance.post("/auth/signup", data),
          {
              loading: "Creating your account...",
              success: "Signup successful! Redirecting...",
              error: (err) => err.response?.data?.message || "Signup failed! Please try again."
          }
      );

      set({ authuser: res.data });
      localStorage.setItem("authuser", JSON.stringify(res.data));

      get().connectsocket(); // ✅ Now called properly

      navigate("/");
  } catch (error) {
      console.error("Signup Error:", error);
  } finally {
      set({ issignup: false });
  }
},

logout: async () => {
    try {
      await axiosinstance.post("/auth/logout"); // ✅ API call for logout

      // ✅ Remove user from state & localStorage
      localStorage.removeItem("authuser");
      set({ authuser: null });

      toast.success("Logged out successfully");
      get().disconnectsocket()

      // ✅ Ensure `disconnectSocket` exists before calling it
      if (get().disconnectSocket) {
        get().disconnectSocket();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed!");
      console.error("Logout Error:", error);
    }
  },
  login: async (data) => {
    try {
      set({ isLoggingIn: true });

      const res = await axiosinstance.post("/auth/login", data);

      // ✅ Save user to state
      set({ authuser: res.data });

      // ✅ Save user to localStorage for persistence
      localStorage.setItem("authuser", JSON.stringify(res.data));

      toast.success("Login successful!");

      get().connectsocket()
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
      console.error("Login Error:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

    updateprofile: async (data) => {
      set({ isupdateprofile: true });
      try {
          const res = await axiosinstance.put("/auth/update", data);
          set({ authuser: res.data });

          // ✅ Store updated user in localStorage
          localStorage.setItem("authuser", JSON.stringify(res.data));

          toast.success("Profile updated successfully");
      } catch (error) {
          console.log("Error in update profile:", error);
          toast.error(error.response?.data?.message || "Profile update failed!");
      } finally {
          set({ isupdateprofile: false });
      }
  },

  connectsocket: () => {
    const { authuser } = get();
    if (!authuser || get().socket?.connected) return;

    const socket = io(baseurl, {
      query: {
          userid: authuser._id, 
      }
  });
  
    socket.connect();

    set({ socket }); // ✅ Store socket in Zustand state

    socket.on("getOnlineUsers" ,(userid)=>{
      set({online:userid})

    })
},


disconnectsocket: () => {
  if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null }); // ✅ Clears socket from state
  }
}

  

  }));
  