export interface Host {
  host: string;
  port: number | null;
}

export async function get(
  path: string,
  api: Host,
  params: Record<string, any> = {},
  headers: Record<string, any> = { 'Accept': 'application/json' }
): Promise<any> {
  const query: Record<string, string> = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null) {
      query[key] = val.toString();
    }
  }

  const base = api.host;
  const port = api.port;
  const search = new URLSearchParams(query).toString();
  // Allow using the functionality with local runned http-api
  const isLocalhost = /^0.0.0.0$/.test(base);
  const protocol = isLocalhost ? "http://" : "https://";

  path = path.startsWith("/") ? path.slice(1) : path;

  const baseUrl = path
    ? `${protocol}${base}/v1/${path}`
    : `${protocol}${base}`;
  const url = new URL(search ? `${baseUrl}?${search}` : baseUrl);
  url.port = String(port);

  const urlString = String(url);
  let response = null;
  try {
    response = await fetch(urlString, {
      method: 'GET',
      headers
    });
  } catch (err) {
    throw new ApiError("API request failed", urlString);
  }

  if (! response.ok) {
    throw new ApiError("Not found", urlString);
  }
  return response.json();
}

export async function post(
  path: string,
  api: Host,
  params: Record<string, any> = {},
  headers: Record<string, any> = { 'Content-Type': 'application/json' },
): Promise<any> {
  const body: Record<string, string> = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null) {
      body[key] = val.toString();
    }
  }

  const base = api.host;
  const port = api.port;
  // Allow using the functionality with local runned http-api
  const isLocalhost = /^0.0.0.0$/.test(base);
  const protocol = isLocalhost ? "http://" : "https://";

  path = path.startsWith("/") ? path.slice(1) : path;

  const url = new URL(path
    ? `${protocol}${base}/v1/${path}`
    : `${protocol}${base}`);
  url.port = String(port);

  const urlString = String(url);
  let response = null;
  try {
    response = await fetch(urlString, {
      method: 'POST',
      body: JSON.stringify(body),
      headers
    });
  } catch (err) {
    throw new ApiError("API request failed", urlString);
  }

  if (! response.ok) {
    throw new ApiError("Not found", urlString);
  }
  return response.json();
}

export async function put(
  path: string,
  api: Host,
  params: Record<string, any> = {},
  headers: Record<string, any> = { 'Content-Type': 'application/json' },
): Promise<any> {
  const body: Record<string, string> = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null) {
      body[key] = val.toString();
    }
  }

  const base = api.host;
  const port = api.port;
  // Allow using the functionality with local runned http-api
  const isLocalhost = /^0.0.0.0$/.test(base);
  const protocol = isLocalhost ? "http://" : "https://";

  path = path.startsWith("/") ? path.slice(1) : path;

  const url = new URL(path
    ? `${protocol}${base}/v1/${path}`
    : `${protocol}${base}`);
  url.port = String(port);

  const urlString = String(url);
  let response = null;
  try {
    response = await fetch(urlString, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers
    });
  } catch (err) {
    throw new ApiError("API request failed", urlString);
  }

  if (! response.ok) {
    throw new ApiError("Not found", urlString);
  }
  return response.json();
}

export class ApiError extends Error {
  url?: string;

  constructor(message: string, url?: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = "ApiError";
    this.url = url;
  }
}
