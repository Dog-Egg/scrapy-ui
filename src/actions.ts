"use server";

import { returnValue } from "./utils/action-helper";
import { request } from "./utils/request";

/**
 * Get the list of projects uploaded to this Scrapy server.
 */
export async function listprojects(baseURL: string) {
  // Example response: {"status": "ok", "projects": ["myproject", "otherproject"]}
  const url = new URL("listprojects.json", baseURL);
  try {
    const response = await request({ url });
    const data = await response.json();
    return data.projects as Array<string>;
  } catch {
    throw new Error("Node request failed.");
  }
}

export async function listversions(baseURL: string, project: string) {
  const response = await request({
    url: new URL(`listversions.json?project=${project}`, baseURL),
  });
  const data = await response.json();
  return data.versions as string[];
}

export async function listspiders(
  baseURL: string,
  project: string,
  version?: string,
) {
  const url = new URL(`listspiders.json?project=${project}`, baseURL);
  if (version) {
    url.searchParams.set("_version", version);
  }
  const response = await request({ url });
  const data = await response.json();
  if (data.status === "error") {
    if ((data.message as string).includes("no active project")) {
      throw Error("No available spiders.");
    } else {
      throw Error(JSON.stringify(data));
    }
  }
  return data.spiders as string[];
}

export async function delproject(baseURL: string, project: string) {
  const url = new URL(`delproject.json`, baseURL);

  const form = new FormData();
  form.append("project", project);

  const response = await request({ url, method: "post", data: form });
  const data = await response.json();
  if (data["status"] !== "ok") {
    throw Error(JSON.stringify(data));
  }
}

export async function delversion(
  baseURL: string,
  project: string,
  version: string,
) {
  const url = new URL("delversion.json", baseURL);
  const formdata = new FormData();
  formdata.append("project", project);
  formdata.append("version", version);
  const response = await request({ url, method: "post", data: formdata });
  const data = await response.json();
  if (data["status"] !== "ok") {
    throw Error(JSON.stringify(data));
  }
}

export async function schedule(
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
      formdata.append(k, v);
    }
  if (options?.arguments)
    for (const [k, v] of Object.entries(options.arguments)) {
      formdata.append(k, v);
    }

  const response = await request({ url, method: "post", data: formdata });
  const data = await response.json();
  if (data.status !== "ok") {
    throw Error(JSON.stringify(data));
  }
}

export async function daemonstatus(baseUrl: string) {
  const url = new URL("daemonstatus.json", baseUrl);
  const response = await request({ url });
  const data: {
    running: number;
    pending: number;
    finished: number;
    node_name: string;
  } = await response.json();
  return data;
}

export type PendingJob = {
  id: string;
  project: string;
  spider: string;
};

export type RunningJob = PendingJob & {
  start_time: string;
};

export type FinishedJob = RunningJob & {
  end_time: string;
  log_url: string;
};

export async function listjobs(baseUrl: string) {
  const url = new URL("listjobs.json", baseUrl);
  let response;
  try {
    response = await request({ url });
  } catch {
    return returnValue.err();
  }
  const data: {
    running: RunningJob[];
    pending: PendingJob[];
    finished: FinishedJob[];
  } = await response.json();
  return returnValue.ok(data);
}
