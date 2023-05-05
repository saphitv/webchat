import { UserInterface } from "./user.interface";

export interface MessageInterface {
  id: number;
  chat_id: number;
  from: UserInterface;
  type: "TEXT" | "IMAGE" | "VIDEO" | "FILE" | "AUDIO" | "LOCATION" | "CONTACT" | "STICKER" | "GIF" | "VOICE";
  cnt: string;
  sendStatus: SendStatus;
  sendTime?: any;
}

export enum SendStatus {
  "sending" = "sending",
  "sent" = "sent",
  "error" = "error",
}

