import {createAction} from "@ngrx/store";
import {UserInterface} from "../../interfaces/user.interface";

export const setUsers = createAction(
  '[Webchat] Set Users',
  (users: UserInterface[]) => ({users})
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
  (user: UserInterface) => ({user})
);

export const loadedUsers = createAction(
  '[Webchat] User Loaded',
  (loading: boolean) => ({loading})
);
