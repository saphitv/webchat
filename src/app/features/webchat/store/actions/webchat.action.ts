import {createAction} from "@ngrx/store";
import {UserInterface} from "../../interfaces/user.interface";

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
