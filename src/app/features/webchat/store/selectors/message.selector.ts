import {createFeatureSelector, createSelector} from "@ngrx/store";
import {WebchatState} from "../reducers/index.reducer";
import {MessageInterface} from "../../interfaces/message.interface";

const featureSelector = createFeatureSelector <WebchatState> ( 'webchat' );

export const selectLastMessage = createSelector(featureSelector, (state: WebchatState) => {
    let lastMessages: {[id_chat: number]: MessageInterface} = {}
    for(const key in state.messages) {
      lastMessages = {...lastMessages, [key]: state.messages[key][state.messages[key].length - 1]}
    }
    return lastMessages
  })
