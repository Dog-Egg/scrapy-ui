const nodes: ScrayUI.Node[] = [{ address: "127.0.0.1:6800" }];

/**
 * 添加 Node。
 */
export function addNode(data: ScrayUI.Node) {
  nodes.push(data);
}

/**
 * 通过 address 获取 Node。
 */
export function getNodeByAddress(address: string) {
  return nodes.find((e) => e.address == address);
}

/**
 * 获取所有节点
 */
export function getAllNodes() {
  return nodes;
}
