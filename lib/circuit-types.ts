export interface Pin {
  id: string;
  name: string;
}

export interface ComponentItem {
  id: string;
  type: string;
  value?: string | null;
  footprint?: string;
  description?: string;
  pins: Pin[];
}

export interface Connection {
  from: string;
  to: string;
}

export interface CircuitMetadata {
  name?: string;
  description?: string;
  powerRequirements?: string;
  assumptions?: string[];
  author?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface CircuitData {
  version: string;
  metadata?: CircuitMetadata;
  components: ComponentItem[];
  connections: Connection[];
}

export interface PromptRequest {
  id: string;
  timestamp: number;
  userPrompt: string;
  systemPrompt: string;
  fullModifiedPrompt: string;
  status: "idle" | "pending" | "completed" | "error";
  rawResponse?: string;
  parsedResponse?: CircuitData | null;
  errorMessage?: string;
}

export interface PresetCircuit {
  id: string;
  title: string;
  prompt: string;
  category: string;
  json: CircuitData;
}
