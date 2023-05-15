import {createAction, props} from "@ngrx/store";
import {UserInterface} from "../../interfaces/user.interface";
import {ChatInterface} from "../../interfaces/chat.interface";

export const loadUsers = createAction(
  '[Webchat] Load Users'
);

export const loadUsersSuccess = createAction(
  '[Webchat] Load Users Success',
  (users: UserInterface[]) => ({users})
);

export const loadUsersFailure = createAction(
  '[Webchat] Load Users Failure',
  (error: any) => ({error})
);

export const loadChats = createAction(
  '[Webchat] Load Chats'
);

export const loadChatsSuccess = createAction(
  '[Webchat] Load Chats Success',
  (chats: any[]) => ({chats})
);

export const loadChatsFailure = createAction(
  '[Webchat] Load Chats Failure',
  (error: any) => ({error})
);

export const setSocketConnected = createAction(
  '[Webchat] Set Socket Connected',
  (socketConnected: boolean) => ({socketConnected})
);

export const searchChat = createAction(
  '[Webchat] Search Chat',
  props<{ text: string }>()
);

export const loadAllUsers = createAction(
  '[Webchat] Load All Users'
);

export const loadAllUsersSuccess = createAction(
  '[Webchat] Load All Users Success',
  (users: UserInterface[]) => ({users})
);

export const loadAllUsersFailure = createAction(
  '[Webchat] Load All Users Failure',
  (error: any) => ({error})
);

export const createChat = createAction(
  '[Webchat] Create Chat',
  props<{ users: number[] }>()
);

export const createChatRequest = createAction(
  '[Webchat] Create Chat Request',
  props<{ chat: ChatInterface }>()
);

export const createChatSuccess = createAction(
  '[Webchat] Create Chat Success',
  props<{ chat: ChatInterface }>()
);

export const createChatFailure = createAction(
  '[Webchat] Create Chat Failure',
  (error: any) => ({error})
);

export const setUsersLoaded = createAction(
  '[Webchat] Set Users Loaded',
  props<{ loaded: boolean }>()
);

export const deleteChat = createAction(
  '[Webchat] Delete Chat',
  props<{ chat: ChatInterface }>()
);

export const deleteChatSuccess = createAction(
  '[Webchat] Delete Chat Success',
  props<{ chatId: number }>()
);

export const deleteChatFailure = createAction(
  '[Webchat] Delete Chat Failure',
  (error: any) => ({error})
);

export const renameChat = createAction(
  '[Webchat] Rename Chat',
  props<{ chat: ChatInterface, name: string }>()
);

export const renameChatSuccess = createAction(
  '[Webchat] Rename Chat Success',
  props<{ chatId: number, name: string }>()
);

export const renameChatFailure = createAction(
  '[Webchat] Rename Chat Failure',
  (error: any) => ({error})
);
