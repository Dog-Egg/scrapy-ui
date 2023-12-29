"use server";

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
  return data.version as string[];
}

export async function listspiders(
  baseURL: string,
  project: string,
  version?: string,
) {
  const url = new URL(`listspiders.json?project=${project}`, baseURL);
  if (version) url.searchParams.set("version", version);
  const response = await request({ url });
  const data = await response.json();
  return data.spiders as string[];
}
