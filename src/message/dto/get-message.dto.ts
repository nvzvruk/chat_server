interface MessageSender {
  id: string;
  name: string;
  avatarSrc?: string;
}

export interface IMessage<T = string> {
  id: string;
  text: string;
  date: Date;
  sender: T;
}

export type MessageDTO = IMessage<MessageSender>;
