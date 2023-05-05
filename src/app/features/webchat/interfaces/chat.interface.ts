import {UserInterface} from "./user.interface";

export interface ChatInterface {
  id: number;
  name?: string;
  users: number[];
  typeChat: "private" | "group";
}
