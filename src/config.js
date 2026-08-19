const removeTrailingSlash = (value) => String(value || "").replace(/\/+$/, "");

const fallbackHost =
  typeof window !== "undefined" ? window.location.hostname : "localhost";

export const API_BASE = removeTrailingSlash(
  import.meta.env.VITE_API_URL || `http://${fallbackHost}:8005`,
);

export const WS_BASE = removeTrailingSlash(
  import.meta.env.VITE_WS_URL || API_BASE.replace(/^http/, "ws"),
);

export const websocketUrl = (path) =>
  `${WS_BASE}${path.startsWith("/") ? path : `/${path}`}`;
