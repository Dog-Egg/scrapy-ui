declare namespace ScrayUI {
  interface Node {
    url: string;
  }

  interface ScrapydDaemonstatusResponse {
    running: number;
    pending: number;
    finished: number;
    node_name: string;
  }
}
