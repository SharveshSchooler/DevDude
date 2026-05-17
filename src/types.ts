export interface Developer {
  id: string;
  name: string;
  role: string;
  stack: string[];
  interests: string[];
  bio?: string;
  avatar?: string;
}

export interface DebugResult {
  analysis: string;
}

export interface RecapResult {
  recap: string;
}

export interface ExplanationResult {
  explanation: string;
}
