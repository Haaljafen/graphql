const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const SIGNIN_PATH = import.meta.env.VITE_SIGNIN_PATH;

function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function extractJwtFromString(s) {
  if (!s) return null;
  const text = String(s).trim();

  const cleaned = text.replace(/^"+|"+$/g, "").replace(/^Bearer\s+/i, "").trim();
  const match = cleaned.match(/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/);
  return match ? match[0] : null;
}

export async function signin(identifier, password) {
  if (!SIGNIN_PATH) {
    throw new Error("Missing VITE_SIGNIN_PATH in .env");
  }

  const url = API_DOMAIN ? new URL(SIGNIN_PATH, API_DOMAIN).toString() : SIGNIN_PATH;
  const basic = toBase64(`${identifier}:${password}`);

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Basic ${basic}`,
        Accept: "application/json, text/plain, */*",
      },
    });
  } catch {
    throw new Error("Network/CORS error while signing in (blocked by browser).");
  }

  const rawText = await res.text();

  if (!res.ok) {
    throw new Error("Invalid credentials or signin failed.");
  }

  let token = null;

  // try JSON
  try {
    const asJson = JSON.parse(rawText);
    token =
      extractJwtFromString(asJson?.token) ||
      extractJwtFromString(asJson?.access_token) ||
      extractJwtFromString(asJson?.jwt);
  } catch {
    // not JSON
  }

  // fallback: extract from text
  if (!token) token = extractJwtFromString(rawText);

  if (!token) {
    console.log("Signin raw response (first 300 chars):", rawText.slice(0, 300));
    throw new Error("Signin did not return a valid JWT.");
  }

  return token;
}
