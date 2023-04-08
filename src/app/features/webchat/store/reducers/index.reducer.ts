import {ActionReducer, createReducer, on} from '@ngrx/store';
import {UserInterface} from "../../interfaces/user.interface";
import {MessageInterface} from "../../interfaces/message.interface";
import { WebchatActionsUser } from "../actions/actions-type";

export interface WebchatState {
  users: UserInterface[],
  currentChat: UserInterface | null,
  messages: { [chatId: number]: MessageInterface[] },

  usersLoaded: boolean,
}
export const initialCoreState: WebchatState = {
  users: [],
  currentChat: null,
  messages: {},
  usersLoaded: false,
};


export const WebchatReducer: ActionReducer<WebchatState> = createReducer(
  initialCoreState,
  on(WebchatActionsUser.setUsers, (state, {users}) => ({...state, users})),
  on(WebchatActionsUser.disconnectUser, (state, {userId}) => ({...state, users: state.users.filter(u => u.id != userId)})),
  on(WebchatActionsUser.connectUser, (state, {user}) => ({...state, users: [user, ...state.users]})),
  on(WebchatActionsUser.setCurrentChat, (state, {user}) => ({...state, currentChat: user})),
  on(WebchatActionsUser.loadedUsers, (state, {loading}) => ({...state, usersLoaded: loading})),
);

