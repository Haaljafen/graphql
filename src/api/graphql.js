import { getToken } from "../utils/token";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const GRAPHQL_PATH = import.meta.env.VITE_GRAPHQL_PATH;

export async function graphqlFetch(query, variables = {}) {
  if (!GRAPHQL_PATH) {
    throw new Error("Missing VITE_GRAPHQL_PATH in .env");
  }

  const token = getToken();
  if (!token) throw new Error("Not authenticated (missing token).");

  const url = API_DOMAIN ? new URL(GRAPHQL_PATH, API_DOMAIN).toString() : GRAPHQL_PATH;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (!res.ok) {
    const msg =
      json?.errors?.[0]?.message ||
      json?.message ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].message || "GraphQL error");
  }

  return json.data;
}
