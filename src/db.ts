const nodes: APIData.Node[] = [{ address: "127.0.0.1:6800" }];

/**
 * 添加 Node。
 */
export function addNode(data: APIData.Node) {
  nodes.push(data);
}

/**
 * 通过 address 获取 Node。
 */
export function getNodeByAddress(address: string) {
  return nodes.find((e) => e.address == address);
}
