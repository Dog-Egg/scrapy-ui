import { test, beforeEach, expect } from "@jest/globals";
import { createJob, createNode, deleteNodeByUrl, getJob } from "./db";
import { dbmigrate } from "../../bin/_migration";

beforeEach(() => {
  return new Promise((resolve) => {
    dbmigrate(process.env.SCRAPY_UI_DATABASE, resolve);
  });
});

test("测试删除 node 会使 job 级联删除", async () => {
  // 创建 node
  const result = await createNode({ url: "http://example.com" });
  expect(result.ok).toBe(true);

  if (result.ok) {
    const node = result.data;

    const jobid = "jobid";
    // 创建 job 1
    await createJob(node.id, jobid, {
      version: 1,
      data: { project: "project", spider: "spider" },
    });

    const job = await getJob(node.id, jobid);
    expect(job?.args).toEqual({
      data: { project: "project", spider: "spider" },
      version: 1,
    });

    // 删除 node
    await deleteNodeByUrl(node.url);
    expect(await getJob(node.id, jobid)).toBeUndefined();
  }
});
