const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Task = () => any;

type Options = {
  interval: number;
};

export class Poller {
  private task;
  private stopped = false;
  private options: Options;
  constructor(task: Task, options: Options = { interval: 1000 }) {
    this.task = task;
    this.options = options;
  }

  async start() {
    while (!this.stopped) {
      await this.task();
      await sleep(this.options.interval);
    }
  }

  stop() {
    this.stopped = true;
  }
}
