"use server";

import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join("scrapy-ui.db"), { verbose: console.log });

export interface Node {
  url: string;
}

/**
 * 添加 Node。
 */
export async function addNode(data: Node) {
  const url = format_url(data.url);
  if (db.prepare("SELECT * FROM nodes WHERE url = ?").get(url)) {
    throw new Error("Node already exists.");
  }
  db.prepare("INSERT INTO nodes (url) VALUES (?)").run(url);
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
