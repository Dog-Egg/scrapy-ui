export async function request<T>({
  url,
  method = "get",
  data,
}: {
  url: string;
  method?: "get" | "post";
  data?: any;
}) {
  const headers: Record<string, string> = {};
  let body;
  if (data) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }
  const response = await fetch(url, { method, headers, body });
  return response;
}
