import { fork, ChildProcess } from 'child_process';

export interface Agent {
  id: string;
  process: ChildProcess;
}

export function createAgent(id: string, context: object): Agent {
  console.log('create agent', id);
  const process = fork('./dist/agentWorker.ts');
  process.send({ type: 'initialize', id, context });
  return { id, process };
}
