import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { UserMeResponse } from "../api/types";

type AuthState = {
  accessToken: string | null;
  user: UserMeResponse | null;
  setSession: (token: string, user: UserMeResponse) => void;
  setUser: (user: UserMeResponse | null) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: (accessToken, user) => set({ accessToken, user }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ accessToken: null, user: null }),
    }),
    { name: "smart-travel-auth" },
  ),
);
