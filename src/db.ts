"use server";

const nodes: ScrayUI.Node[] = [
  { url: "http://127.0.0.1:6800/" },
  { url: "http://127.0.0.1:6801/" },
];

/**
 * 添加 Node。
 */
export async function addNode(data: ScrayUI.Node) {
  if (!data.url.endsWith("/")) {
    data.url = data.url.concat("/");
  }
  nodes.push(data);
}

/**
 * 通过 url 获取 Node。
 */
export async function getNodeByURL(address: string) {
  return nodes.find((e) => e.url == address);
}

/**
 * 获取所有节点
 */
export async function getAllNodes() {
  return nodes;
}
