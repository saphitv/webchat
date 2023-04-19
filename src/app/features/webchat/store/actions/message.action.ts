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
  '[Webchat Effect] Receive Message',
  (message: MessageInterface) => ({message})
);

export const serverMessage = createAction(
  '[SocketIO Server] Server Message',
  (message: MessageInterface) => ({message})
);

export const receiveMessageError = createAction(
  '[Webchat Effect] Receive Message Error'
);


