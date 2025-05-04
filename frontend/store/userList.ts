import { create } from "zustand";

interface User {
  _id: string;
  username: string;
}

interface UserListState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (token: string) => Promise<void>;
}

export const useUserList = create<UserListState>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async (token: string) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/auth/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.statusText}`);
      }

      const data: User[] = await res.json();
      set({ users: data, loading: false });
    } catch (err: Error | unknown) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        loading: false,
      });
    }
  },
}));
