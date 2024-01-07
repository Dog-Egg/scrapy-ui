export async function request({
  url,
  method = "get",
  data,
}: {
  url: string | URL;
  method?: "get" | "post";
  data?: any;
}) {
  const headers: Record<string, string> = {};
  let body;
  if (data instanceof FormData) {
    body = data;
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }
  const response = await fetch(url, {
    method,
    headers,
    body,
    cache: "no-store",
  });
  return response;
}
