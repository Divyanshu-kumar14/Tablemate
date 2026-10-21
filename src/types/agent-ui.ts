export interface AgentStep {
  step: string;
  status: "running" | "done" | "error";
  detail?: string;
  ms?: number;
}

export interface AgentDone {
  count: number;
  ms: number;
  degraded: string[];
  request_id: string;
  mode: "live" | "mock";
  qloo_calls: number;
  llm_used: boolean;
}
