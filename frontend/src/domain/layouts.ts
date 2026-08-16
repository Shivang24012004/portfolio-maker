import type { PuckData } from "../puck/config";

export interface LayoutData {
  id: string;
  name: string;
  version: number;
  content: PuckData | Record<string, unknown>;
}

export type Portfolio = LayoutData;
export type Layout = LayoutData;
