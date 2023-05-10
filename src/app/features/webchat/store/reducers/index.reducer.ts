import {ActionReducer, createReducer, on} from '@ngrx/store';
import {UserInterface} from "../../interfaces/user.interface";
import {MessageInterface, SendStatus} from "../../interfaces/message.interface";
import {WebchatActionsChat, WebchatActionsMessage, WebchatActionsUser} from "../actions/actions-type";
import {ChatInterface} from "../../interfaces/chat.interface";

export interface WebchatState {
  chats: ChatInterface[],
  users: UserInterface[]
  currentChat: ChatInterface | null,
  messages: { [userId: number]: MessageInterface[] }, // to change later on with chatId
  usersLoaded: boolean,
  chatsLoaded: boolean,
  socketConnected: boolean,
  textChatFilter: string,
  allUsers: UserInterface[],
}
export const initialCoreState: WebchatState = {
  users: [],
  allUsers: [],
  chats: [],
  currentChat: null,
  messages: {},
  usersLoaded: false,
  chatsLoaded: false,
  socketConnected: false,
  textChatFilter: '',
};


export const WebchatReducer: ActionReducer<WebchatState> = createReducer(
  initialCoreState,


  // load data from db
  on(WebchatActionsChat.loadUsersSuccess, (state, {users}) =>
    ({...state, users, usersLoaded: true})),
  on(WebchatActionsChat.setUsersLoaded, (state, {loaded}) =>
    ({...state, usersLoaded: loaded})),
  on(WebchatActionsChat.loadAllUsersSuccess, (state, {users}) =>
    ({...state, allUsers: users})),
  on(WebchatActionsChat.loadChatsSuccess, (state, {chats}) =>
    ({...state, chats, chatsLoaded: true})),


  // socket
  on(WebchatActionsChat.setSocketConnected, (state, {socketConnected}) =>
    ({...state, socketConnected})),
  on(WebchatActionsUser.disconnectUser, (state, {userId}) =>
    ({...state, users: state.users.filter(u => u.id != userId)})),

  on(WebchatActionsUser.connectUser, (state, {user}) =>
    ({...state, users: [user, ...state.users]})),

  on(WebchatActionsUser.setCurrentChat, (state, {chat}) =>
    ({...state, currentChat: chat})),

  on(WebchatActionsUser.loadedDB, (state, {loading}) =>
    ({...state, dbLoaded: loading})),

  on(WebchatActionsUser.loadedSocket, (state, {loading}) =>
    ({...state, socketLoaded: loading})),

  on(WebchatActionsChat.createChatSuccess, (state, {chat}) =>
    ({...state, chats: [...state.chats, chat]})),


  // messages

  on(WebchatActionsMessage.sendMessage, (state, props: { message: MessageInterface }) =>
    ({
      ...state, messages: {
        ...state.messages, [props.message.chat_id]: [...(state.messages[props.message.chat_id] || []), {
          ...props.message,
          sendStatus: SendStatus.sending
        }]
      }
    })
  ),

  on(WebchatActionsMessage.sendMessageSuccess, (state: WebchatState, props: {message: MessageInterface}): WebchatState => {
    const newUserMes = state.messages[props.message.chat_id].map(m => {
      if (m.id == props.message.id) {
        return {...m, sendStatus: SendStatus.sent}
      } else {
        return m
      }
    })

    return {...state, messages: {...state.messages, [props.message.chat_id]: newUserMes}}
  }),

  on(WebchatActionsMessage.sendMessageError, (state: WebchatState, props: {message: MessageInterface}): WebchatState => {
    const newUserMes = state.messages[props.message.chat_id].filter(m => m.id != props.message.id)

    return {...state, messages: {...state.messages, [props.message.chat_id]: newUserMes}}
  }),

  on(WebchatActionsMessage.receiveMessage, (state: WebchatState, props: { message: MessageInterface }): WebchatState =>
    ({...state,
      messages: {
        ...state.messages,
        [props.message.chat_id]: [...(state.messages[props.message.chat_id] || []), props.message]
      }
    })
  ),

  on(WebchatActionsMessage.loadChatMessagesSuccess, (state, props: { messages: MessageInterface[], chatId: number }): WebchatState =>
    ({
      ...state,
      messages: {...state.messages, [props.chatId]: props.messages},
      chats: state.chats.map(c => c.id == props.chatId ? {...c, messageLoaded: true} : c)
    })
  ),

  on(WebchatActionsChat.searchChat, (state, props: { text: string }): WebchatState =>
    ({...state, textChatFilter: props.text})
  ),
);

