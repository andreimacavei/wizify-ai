import { crypto } from "crypto";

export function generateUrlSafeBase64ApiKey(length = 32) {
  // Generate a random array of bytes
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  // Convert the bytes to Base64
  const base64String = btoa(String.fromCharCode.apply(null, randomBytes));

  // Make the Base64 string URL-safe by replacing '+' with '-', '/' with '_', and removing '='
  const urlSafeBase64String = base64String
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return urlSafeBase64String;
}
