import create from "zustand";
import { persist } from "zustand/middleware";

// const useStore = create((set, get) => ({
//   phone: null,
//   setPhone: (phone) => set({ phone }),
//   email: null,
//   setEmail: (email) => set({ email }),
//   user: null,
//   setUser: (user) => set({ user }),
// }));

const useStore = create(
    persist(
        (set, get) => ({
            phone: null,
            setPhone: (phone) => set({ phone }),
            email: null,
            setEmail: (email) => set({ email }),
            user: null,
            setUser: (user) => set({ user }),
            sessionExpired: false,
            setSessionExpired: (sessionExpired) => set({ sessionExpired }),
        }),
        {
            name: "nivesh-storage", // unique name
            // getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
            // partialize: (state) =>
            //   Object.fromEntries(
            //     Object.entries(state).filter(
            //       ([key]) => !["sessionExpired"].includes(key)
            //     )
            //   ),
        }
    )
);

export default useStore;
