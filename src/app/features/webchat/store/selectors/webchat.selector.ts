import {WebchatState} from "../reducers/index.reducer";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {UserInterface} from "../../interfaces/user.interface";
import {MessageInterface} from "../../interfaces/message.interface";

const featureSelector = createFeatureSelector<WebchatState>('webchat');

export const selectUsers = createSelector(
  featureSelector,
  (state: WebchatState) => state.users);

export const selectAllUsers = createSelector(
  featureSelector,
  (state: WebchatState) => state.allUsers);

export const selectChats = createSelector(
  featureSelector,
  (state: WebchatState) => state.chats);
export const selectCurrentChat = createSelector(featureSelector, (state: WebchatState) => state.currentChat);

export const selectUserByName = (props: { name: string }) =>
  createSelector(selectUsers, (users: UserInterface[]) => {
    return users.find(u => u.username == props.name)
  })

export const areUsersLoaded = createSelector(featureSelector, (state: WebchatState) => state.usersLoaded);
export const areChatsLoaded = createSelector(featureSelector, (state: WebchatState) => state.chatsLoaded);
export const isSocketConnected = createSelector(featureSelector, (state: WebchatState) => state.socketConnected);

export const selectMessages = createSelector(featureSelector, (state: WebchatState) => state.messages);

export const selectMessagesByChatId = (props: { chatId: number}) =>
  createSelector(selectMessages, (messages: { [userId: number]: MessageInterface[] }) => {
    console.log("messages", props.chatId, messages)
    return messages[props.chatId]
  })

export const selectMessagesFromCurrentChat = createSelector(
  featureSelector,
  selectCurrentChat,
  (state, currentChat) => {
    return currentChat != null ?
      state.messages[currentChat.id]
      : []
  }
)

export const isUserSelected = createSelector(featureSelector, (state: WebchatState) => state.currentChat != null);

export const selectTextChatFilter = createSelector(featureSelector, (state: WebchatState) => state.textChatFilter);

export const selectChatById = (props: { chatId: number }) =>
  createSelector(selectChats, (chats) => {
    return chats.find(c => c.id == props.chatId)
  })
