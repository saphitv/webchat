import {ActionReducer, createReducer, on} from '@ngrx/store';
import {UserInterface} from "../../interfaces/user.interface";
import {MessageInterface, SendStatus} from "../../interfaces/message.interface";
import {WebchatActionsMessage, WebchatActionsUser} from "../actions/actions-type";

export interface WebchatState {
  users: UserInterface[],
  currentChat: UserInterface | null,
  messages: { [userId: number]: MessageInterface[] }, // to change later on with chatId
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


  // users

  on(WebchatActionsUser.setUsers, (state, {users}) =>
    ({...state, users})),

  on(WebchatActionsUser.disconnectUser, (state, {userId}) =>
    ({...state, users: state.users.filter(u => u.id != userId)})),

  on(WebchatActionsUser.connectUser, (state, {user}) =>
    ({...state, users: [user, ...state.users]})),

  on(WebchatActionsUser.setCurrentChat, (state, {user}) =>
    ({...state, currentChat: user})),

  on(WebchatActionsUser.loadedUsers, (state, {loading}) =>
    ({...state, usersLoaded: loading})),



  // messages

  on(WebchatActionsMessage.sendMessage, (state, props: {message: MessageInterface}) =>
    ({...state, messages: {...state.messages, [props.message.to.id]: [...(state.messages[props.message.to.id] || []), {
          ...props.message,
          sendStatus: SendStatus.sending
        }]}})
  ),

  on(WebchatActionsMessage.sendMessageSuccess, (state: WebchatState, props: {message: MessageInterface}): WebchatState => {
    const newUserMes = state.messages[props.message.to.id].map(m => {
      if (m.id == props.message.id) {
        return {...m, sendStatus: SendStatus.sent}
      } else {
        return m
      }
    })

    return {...state, messages: {...state.messages, [props.message.to.id]: newUserMes}}
  }),

  on(WebchatActionsMessage.sendMessageError, (state: WebchatState, props: {message: MessageInterface}): WebchatState => {
    const newUserMes = state.messages[props.message.to.id].filter(m => m.id != props.message.id)

    return {...state, messages: {...state.messages, [props.message.to.id]: newUserMes}}
  }),
);

