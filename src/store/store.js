import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useSession } from "next-auth/react";

const panelStore = (set) => ({
  isPanelOpen: true,
  allUsers: [],
  hadPastChatsWith: [],
  // receiverId: null,
  revertPanelStatus: () => {
    set((state) => ({
      isPanelOpen: !state.isPanelOpen,
    }));
  },
  closePanel: () => {
    set((state) => ({
      isPanelOpen: false,
    }));
  },
  sethadPastChatsWith: (updater) => {
    set((state) => ({
      hadPastChatsWith:
        typeof updater === "function"
          ? updater(state.hadPastChatsWith)
          : updater,
    }));
  },
  // setreceiverId: (id) => {
  //   set({ receiverId: id });
  // },
});

const chatStore = (set,get) => ({
  messages: [],
  message: null,
  receiverName: null,
  receiverId: null,
  chatId: null,
  setmessages: (updater) => {
    set((state) => ({
      messages:
        typeof updater === "function" ? updater(state.messages) : updater,
    }));
  },
  setreceiverName: (name) => {
    set({receiverName: name})
  },
  setreceiverId: (id) => {
    set({receiverId: id})
  },
  setchatId: (id) => {
    set({chatId: id})
  }
});

const socketStore = (set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
});

// const sessionStore = (set) => ({
//   session: {},
//   setSession: (session) => {
//     set((state) => ({ session}));
//   },
// });

const screenStore = (set) => ({
  isSmallScreen: window.innerWidth < 640,
  setisSmallScreen: (value) => {
    set({ isSmallScreen: value });
  },
});

export const usePanelStore = create(
  devtools(persist(panelStore, { name: "panel" }))
);

export const useSocketStore = create(
  devtools(persist(socketStore, { name: "socket" }))
);

// export const useSessionStore = create(
//   devtools(persist(sessionStore, { name: "session" }))
// );

export const useScreenStore = create(
  devtools(persist(screenStore, { name: "screen" }))
);

export const useChatStore = create(
  devtools(persist(chatStore, { name: "chat" }))
);
