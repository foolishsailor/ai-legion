import { last } from 'lodash';
import ActionHandler from './action-handler';
import makeDecision from './make-decision';
import { Memory } from './memory';
import { ModuleManager } from './module/module-manager';
import { messageBuilder } from './message';
import { MessageBus } from './message-bus';

import parseAction from './parse-action';
import TaskQueue from './task-queue';
import { agentName, sleep } from './util';

import { fork, ChildProcess } from 'child_process';

let memory: Memory;
let actionHandler: ActionHandler;
let moduleManager: ModuleManager;
let messageBus: MessageBus;
let taskQueue = new TaskQueue();
let agentId: string;
const actionInterval = 10 * 1000;

const agentWorker = (() => {
  function initialize(id: string, context: any): void {
    agentId = id;
    memory = context.memory;
    actionHandler = context.actionHandler;
    moduleManager = context.moduleManager;
    messageBus = context.messageBus;

    console.log(`Agent ${id} initialized`);

    messageBus.subscribe((message) => {
      if (message.targetAgentIds && !message.targetAgentIds.includes(id))
        return;
      memory.append({ type: 'message', message });
    });

    taskQueue.runPeriodically(() => takeAction(), actionInterval);
  }

  async function takeAction(): Promise<void> {
    try {
      let events = await memory.retrieve();

      // Do not act again if the last event was a decision
      if (last(events)?.type === 'decision') return;

      const actionText = await makeDecision(events);

      // Reassign events in case summarization occurred
      events = await memory.append({
        type: 'decision',
        actionText,
      });

      const result = parseAction(moduleManager.actions, actionText);
      if (result.type === 'error') {
        messageBus.send(messageBuilder.error(agentId, result.message));
      } else {
        await actionHandler.handle(agentId, result.action);
      }
    } catch (e) {
      console.error(
        `${agentName(
          agentId
        )} encountered the following problem while attempting to take action:`
      );
      console.error(e);
    } finally {
      await sleep(5000);
    }
  }

  // function handleMessage(from: number, to: number, content: string): void {
  //   console.log(`Agent ${from} to Agent ${to}: ${content}`);

  // }

  return {
    initialize,
  };
})();
