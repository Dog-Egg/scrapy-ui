export interface ScrapydNode {
  url: string;
}

export interface DBNode extends ScrapydNode {
  id: number;
}

export type JobArgs = {
  project: string;
  spider: string;
  version?: string;
  arguments?: { key: string; value: string }[];
  settings?: { key: string; value: string }[];
  priority?: string;
};
