"use server";

import { Code } from "@/utils/enum";

export type ResultType<T> =
  | { code: Code.OK; data: T }
  | { code: Code.FETCH_FAILED }
  | { code: Code.SCRAPYD_ERROR; message: string };

/**
 * Get the list of projects uploaded to this Scrapy server.
 */
export const listprojects = wrap(async function (baseUrl: string) {
  // Example response: {"status": "ok", "projects": ["myproject", "otherproject"]}
  const url = new URL("listprojects.json", baseUrl);
  const response = await request(url);
  const data = await response.json();
  return data.projects as Array<string>;
});

export const listversions = wrap(async function (
  baseURL: string,
  project: string,
) {
  const url = new URL(`listversions.json?project=${project}`, baseURL);
  const response = await request(url);
  const data = await response.json();
  return data.versions as string[];
});

export const listspiders = wrap(async function (
  baseURL: string,
  project: string,
  version?: string,
) {
  const url = new URL(`listspiders.json?project=${project}`, baseURL);
  if (version) {
    url.searchParams.set("_version", version);
  }
  const response = await request(url);
  const data = await response.json();
  if (data.status === "error") {
    if ((data.message as string).includes("no active project")) {
      throw Error("No available spiders.");
    } else {
      throw Error(JSON.stringify(data));
    }
  }
  return data.spiders as string[];
});

export const delproject = wrap(async function delproject(
  baseURL: string,
  project: string,
) {
  const url = new URL(`delproject.json`, baseURL);

  const form = new FormData();
  form.append("project", project);

  const response = await request(url, { method: "post", body: form });
  const data = await response.json();
  if (data.status !== "ok") {
    throw new ScrapydError(data.message);
  }
});

export const delversion = wrap(async function (
  baseURL: string,
  project: string,
  version: string,
) {
  const url = new URL("delversion.json", baseURL);
  const formdata = new FormData();
  formdata.append("project", project);
  formdata.append("version", version);
  const response = await request(url, { method: "post", body: formdata });
  const data = await response.json();
  if (data["status"] !== "ok") {
    throw Error(JSON.stringify(data));
  }
});

export const schedule = wrap(async function (
  baseURL: string,
  project: string,
  spider: string,
  options?: {
    version?: string;
    priority?: number;
    settings?: Record<string, string>;
    arguments?: Record<string, string>;
  },
) {
  const url = new URL("schedule.json", baseURL);

  const formdata = new FormData();
  formdata.append("project", project);
  formdata.append("spider", spider);
  options?.version && formdata.append("_version", options.version);
  options?.priority && formdata.append("priority", options.priority.toString());
  if (options?.settings)
    for (const [k, v] of Object.entries(options.settings)) {
      formdata.append("setting", `${k}=${v}`);
    }
  if (options?.arguments)
    for (const [k, v] of Object.entries(options.arguments)) {
      formdata.append(k, v);
    }

  const response = await request(url, { method: "post", body: formdata });
  const data = await response.json();
  if (data.status !== "ok") {
    throw Error(JSON.stringify(data));
  }
});

export const daemonstatus = wrap(async function (
  baseUrl: string,
  timeout?: number,
) {
  const url = new URL("daemonstatus.json", baseUrl);

  const controller = new AbortController();
  const t = setTimeout(() => {
    controller.abort();
  }, timeout);
  const response = await request(url, { signal: controller.signal }).finally(
    () => {
      clearTimeout(t);
    },
  );
  const data: {
    running: number;
    pending: number;
    finished: number;
    node_name: string;
  } = await response.json();
  return data;
});

export type PendingJob = {
  id: string;
  project: string;
  spider: string;
};

export type RunningJob = PendingJob & {
  start_time: string;

  /* from fork: https://github.com/Dog-Egg/scrapyd */
  log_url?: string;
  items_url?: string;
};

export type FinishedJob = RunningJob & {
  end_time: string;
  log_url: string;
  items_url?: string;
};

export const listjobs = wrap(async function (baseUrl: string): Promise<{
  running: RunningJob[];
  pending: PendingJob[];
  finished: FinishedJob[];
}> {
  const url = new URL("listjobs.json", baseUrl);
  const response = await request(url);
  const data = await response.json();
  return data;
});

export const cancel = wrap(async function (
  baseUrl: string,
  project: string,
  jobId: string,
) {
  const url = new URL("cancel.json", baseUrl);
  const form = new FormData();
  form.append("project", project);
  form.append("job", jobId);
  const response = await request(url, { method: "post", body: form });
  return (await response.json()) as { prevstate: "running" | "pending" };
});

class FetchError extends Error {}
class ScrapydError extends Error {}

async function request(url: string | URL, init?: RequestInit) {
  try {
    return await fetch(url, {
      cache: "no-store",
      ...init,
    });
  } catch {
    throw new FetchError();
  }
}

export const viewLog = wrap(async function (baseUrl: string, logUrl: string) {
  const url = new URL(logUrl, baseUrl);
  const response = await request(url);
  return await response.text();
});

export const viewItems = wrap(async function viewItems(
  baseUrl: string,
  itemsUrl: string,
) {
  const url = new URL(itemsUrl, baseUrl);
  const response = await request(url);
  return await response.text();
});

export const addversion = wrap(async function addVersion(
  baseUrl: string,
  body: FormData,
) {
  const url = new URL("addversion.json", baseUrl);
  const response = await request(url, { method: "post", body });
  const data = await response.json();
});

/**高阶函数。负责处理异常，包装为 HTTP 200 的响应结果，避免 client 端调用抛出错误。 */
function wrap<
  T extends (...args: any[]) => Promise<P>,
  P = ReturnType<T> extends Promise<infer S> ? S : unknown,
>(fn: T) {
  const wrapper: (...args: Parameters<typeof fn>) => Promise<ResultType<P>> =
    async function (...args) {
      try {
        return { code: Code.OK, data: await fn(...args) };
      } catch (e) {
        if (e instanceof FetchError) {
          return { code: Code.FETCH_FAILED };
        } else if (e instanceof ScrapydError) {
          return { code: Code.SCRAPYD_ERROR, message: e.message };
        }
        throw e;
      }
    };
  return wrapper;
}
