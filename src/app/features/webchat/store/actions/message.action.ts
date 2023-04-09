import {createAction} from "@ngrx/store";
import {MessageInterface} from "../../interfaces/message.interface";

export const sendMessage = createAction(
  '[Webchat] Send Message',
  (message: MessageInterface) => ({message})
);

export const sendMessageSuccess = createAction(
  '[Webchat] Send Message Success',
  (message: MessageInterface) => ({message})
);

export const sendMessageError = createAction(
  '[Webchat] Send Message Error',
  (message: MessageInterface) => ({message})
);

export const receiveMessage = createAction(
  '[Webchat] Receive Message',
  (message: MessageInterface) => ({message})
);

