import { UserInterface } from "./user.interface";

export interface MessageInterface {
  id: number;
  to: UserInterface;
  from: UserInterface;
  type: string;
  cnt: string;
  sendStatus: SendStatus;
  sendTime?: any;
}

export enum SendStatus {
  "sending" = "sending",
  "sent" = "sent",
  "error" = "error",
}

