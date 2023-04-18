import { Store } from "./factories";
import InMemoryStore from "./factories/in-memory-store";

export interface AppStateProperties {
  activeAgents?: string[];
  isRunning?: boolean;
  isTest?: boolean;
  model?: string;
}

export class AppState {
  private static instance: AppState;
  private store: InMemoryStore;
  private properties: AppStateProperties;

  private constructor(initialState: AppStateProperties = {}) {
    this.store = new InMemoryStore<AppStateProperties>();
    this.properties = {
      activeAgents: initialState.activeAgents || [],
      isRunning: initialState.isRunning || false,
      isTest: initialState.isTest || false,
      model: initialState.model || "",
    };
  }

  public static getInstance(initialState?: AppStateProperties): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState(initialState);
    }
    return AppState.instance;
  }

  public get(key: keyof AppStateProperties): any {
    return this.properties[key];
  }

  public set(key: keyof AppStateProperties, value: any): void {
    this.properties[key] = value;
  }
}
