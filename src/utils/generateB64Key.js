import * as crypto from "crypto";

export default function generateUrlSafeBase64ApiKey(length = 32) {
  // Generate a random buffer of bytes
  const buffer = crypto.randomBytes(length);

  // Convert the buffer to a Base64 string
  const base64String = buffer.toString("base64");

  // Make the Base64 string URL-safe by replacing '+' with '-', '/' with '_', and removing '='
  const urlSafeBase64String = base64String
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return urlSafeBase64String;
}
