export function getJwtExpiryInSeconds(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");

    const payload = JSON.parse(atob(padded));
    if (!payload.exp) return null;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const remaining = payload.exp - nowInSeconds;

    return remaining > 0 ? remaining : 0;
  } catch {
    return null;
  }
}