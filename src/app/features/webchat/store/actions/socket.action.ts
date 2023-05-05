import {createAction} from "@ngrx/store";
import {UserInterface} from "../../interfaces/user.interface";
import {ChatInterface} from "../../interfaces/chat.interface";

export const setUsers = createAction(
  '[Webchat] Set Users',
  (users: UserInterface[]) => ({users})
);

export const setChats = createAction(
  '[Webchat] Set Chats',
  (chats: ChatInterface[]) => ({chats})
);

export const disconnectUser = createAction(
  '[Webchat] Disconnect User',
  (userId: number) => ({userId})
);

export const connectUser = createAction(
  '[Webchat] Connect User',
  (user: UserInterface) => ({user})
);

export const setCurrentChat = createAction(
  '[Webchat] Set Current Chat',
  (chat: ChatInterface) => ({chat})
);

export const loadedDB = createAction(
  '[Webchat] Loaded DB',
  (loading: boolean) => ({loading})
);

export const loadedSocket = createAction(
  '[Webchat] Loaded Socket',
  (loading: boolean) => ({loading})
);
