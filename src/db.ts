"use server";

const nodes: ScrayUI.Node[] = [
  { url: "http://127.0.0.1:6800/" },
  { url: "http://127.0.0.1:6801/" },
];

/**
 * 添加 Node。
 */
export async function addNode(data: ScrayUI.Node) {
  nodes.push({ ...data, url: format_url(data.url) });
}

/**
 * 通过 url 获取 Node。
 */
export async function getNodeByURL(url: string) {
  return nodes.find((i) => i.url == format_url(url));
}

/**
 * 获取所有节点
 */
export async function getAllNodes() {
  return nodes;
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

export async function getEnabledNodes() {
  return nodes;
}
