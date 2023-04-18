import { ControlMessage } from "../message";
import { MessageBus } from "../message-bus";

export class MessageAction {
  private messageBus: MessageBus;

  constructor(messageBus: MessageBus) {
    this.messageBus = messageBus;
  }
}
