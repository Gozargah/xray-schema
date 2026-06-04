const snippetModules = import.meta.glob("../protocols/**/snippets/*.json", {
  eager: true,
  import: "default",
}) as Record<string, { label: string; description: string; body: { protocol?: string } }>;

const protocolOrder = ["vless", "trojan", "vmess", "shadowsocks", "socks", "hysteria", "tun"];

const inboundSnippets = Object.values(snippetModules).sort((a, b) => {
  const protocolA = typeof a?.body?.protocol === "string" ? a.body.protocol : "";
  const protocolB = typeof b?.body?.protocol === "string" ? b.body.protocol : "";
  const orderA = protocolOrder.indexOf(protocolA);
  const orderB = protocolOrder.indexOf(protocolB);
  if (orderA !== orderB) {
    const rankA = orderA === -1 ? Number.POSITIVE_INFINITY : orderA;
    const rankB = orderB === -1 ? Number.POSITIVE_INFINITY : orderB;
    return rankA - rankB;
  }
  const labelA = typeof a?.label === "string" ? a.label : "";
  const labelB = typeof b?.label === "string" ? b.label : "";
  return labelA.localeCompare(labelB);
});

export { inboundSnippets };
