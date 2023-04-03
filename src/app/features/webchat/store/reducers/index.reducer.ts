import {ActionReducer, createReducer, on} from '@ngrx/store';
import {UserInterface} from "../../interfaces/user.interface";
import {MessageInterface} from "../../interfaces/message.interface";
import {WebchatActions} from "../actions/actions-type";

export interface WebchatState {
  users: UserInterface[],
  currentChat: UserInterface | null,
  messages: { [chatId: number]: MessageInterface[] }
}
export const initialCoreState: WebchatState = {
  users: [],
  currentChat: null,
  messages: {}
};


export const WebchatReducer: ActionReducer<WebchatState> = createReducer(
  initialCoreState,
  on(WebchatActions.setUsers, (state, {users}) => ({...state, users})),
  on(WebchatActions.disconnectUser, (state, {userId}) => ({...state, users: state.users.filter(u => u.id != userId)})),
  on(WebchatActions.connectUser, (state, {user}) => ({...state, users: [user, ...state.users]})),
  on(WebchatActions.setCurrentChat, (state, {user}) => ({...state, currentChat: user})),
);

