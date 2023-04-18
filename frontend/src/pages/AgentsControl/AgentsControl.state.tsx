import { Message } from '../../types/message';
import { Socket } from 'socket.io-client';

export interface AgentsControlState {
  activeAgents: string[];
  messages: Message[];
  selectedAgent: string | undefined;
}

export const initialState: AgentsControlState = {
  activeAgents: [],
  messages: [],
  selectedAgent: undefined
};
