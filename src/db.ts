"use server";

import Database from "better-sqlite3";
import { ReturnValue, returnValue } from "./utils/action-helper";

const filename = process.env.SCRAPY_UI_DATABASE || "scrapy-ui.db";
const db = new Database(filename, {
  verbose: process.env.NODE_ENV == "development" ? console.log : undefined,
});

export interface Node {
  url: string;
}

/**
 * 添加 Node。
 */
export async function addNode(data: Node): Promise<ReturnValue<Node>> {
  const url = format_url(data.url);
  if (db.prepare("SELECT * FROM nodes WHERE url = ?").get(url)) {
    return returnValue.err({ message: "Node already exists." });
  }
  db.prepare("INSERT INTO nodes (url) VALUES (?)").run(url);
  return returnValue.ok({ url });
}

export async function deleteNodeByUrl(url: string) {
  db.prepare("DELETE FROM nodes WHERE url = ?").run(url);
}

/**
 * 获取所有节点
 */
export async function getAllNodes() {
  return db.prepare("SELECT * FROM nodes").all() as Node[];
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
