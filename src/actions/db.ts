"use server";

import Database from "better-sqlite3";
import { ReturnValue, returnValue } from "../utils/action-helper";
import { DBNode, JobArgs, ScrapydNode } from "@/utils/types";

const filename = process.env.SCRAPY_UI_DATABASE || "scrapy-ui.db";
const db = new Database(filename, {
  verbose: process.env.NODE_ENV == "development" ? console.log : undefined,
});

type NodeID = number;

/**
 * 添加 Node。
 */
export async function createNode(
  data: ScrapydNode,
): Promise<ReturnValue<DBNode>> {
  const url = format_url(data.url);
  if (db.prepare("SELECT * FROM nodes WHERE url = ?").get(url)) {
    return returnValue.err({ message: "Node already exists." });
  }
  const result = db.prepare("INSERT INTO nodes (url) VALUES (?)").run(url);
  return returnValue.ok({ id: result.lastInsertRowid as number, url });
}

export async function deleteNodeByUrl(url: string) {
  db.prepare("DELETE FROM nodes WHERE url = ?").run(url);
}

export async function getNodeByURL(url: string) {
  return db.prepare("SELECT * FROM nodes WHERE url = ?").get(url) as
    | undefined
    | { id: number; url: string };
}

/**
 * 获取所有节点
 */
export async function getAllNodes() {
  return db.prepare("SELECT * FROM nodes").all() as DBNode[];
}

/**
 * 节点 URL 必须以 '/' 结尾。
 */
function format_url(url: string) {
  if (!url.endsWith("/")) {
    url = url.concat("/");
  }
  return url;
}

type JobArgsV1 = { version: 1; data: JobArgs };

/**
 * 创建 job, 用于 “copy job”。
 * @param jobid
 * @param args: job 参数
 * @returns
 */
export async function createJob(
  nodeid: NodeID,
  jobid: string,
  args: JobArgsV1,
) {
  return db
    .prepare("INSERT INTO jobs (nodeid, jobid, args) VALUES (?, ?, ?)")
    .run(nodeid, jobid, JSON.stringify(args));
}

export async function getJob(nodeid: NodeID, jobid: string) {
  const row = db
    .prepare("SELECT * FROM jobs WHERE nodeid = ? AND jobid = ?")
    .get(nodeid, jobid) as
    | {
        nodeid: NodeID;
        jobid: string;
        args: string;
      }
    | undefined;
  return row && { ...row, args: JSON.parse(row.args) as JobArgsV1 };
}
