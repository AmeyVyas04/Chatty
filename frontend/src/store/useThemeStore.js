import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "light", // ✅ Load from storage
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme); // ✅ Save to storage
    document.documentElement.setAttribute("data-theme", theme); // ✅ Apply globally
    set({ theme });
  },
}));
