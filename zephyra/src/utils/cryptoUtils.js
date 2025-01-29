import customFetch from "./customFetch";

// filepath: /Users/abhinavjain/dev/zephyra/zephyra/src/cryptoUtils.js
export async function generateKey() {
  const response = await customFetch(
    `${process.env.REACT_APP_API_BASE_URL}/mynewapp/mynewapp/generate-aes-key/`
  );
  console.log(response);
  const data = await response.json();

  const keyBuffer = Uint8Array.from(atob(data.key), (c) => c.charCodeAt(0));

  return await window.crypto.subtle.importKey(
    "raw",
    keyBuffer,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFiles(files) {
  const key = await generateKey();
  return await Promise.all(
    files.map(async (file) => {
      const { encryptedBuffer, iv } = await encryptFile(file, key);
      return {
        name: file.name,
        size: file.size,
        dateModified: file.lastModifiedDate,
        lastModifiedDate: file.lastModifiedDate,
        encryptedBuffer,
        iv,
        key,
        type: file.type,
      };
    })
  );
}

export async function encryptFile(file, key) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const fileBuffer = await file.arrayBuffer();
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    fileBuffer
  );
  return { encryptedBuffer, iv };
}

export async function decryptFile(encrypted_data, key, iv, type, tag) {
  const encryptedBufferArray = Uint8Array.from(atob(encrypted_data), (c) =>
    c.charCodeAt(0)
  );
  const tagArray = Uint8Array.from(atob(tag), (c) => c.charCodeAt(0));

  const ivArray = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const keyArray = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));

  // Import the key
  const combinedBuffer = new Uint8Array(
    encryptedBufferArray.length + tagArray.length
  );
  combinedBuffer.set(encryptedBufferArray);
  combinedBuffer.set(tagArray, encryptedBufferArray.length);

  // Import the key
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyArray,
    "AES-GCM",
    true,
    ["decrypt"]
  );

  // Decrypt the buffer
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivArray,
    },
    cryptoKey,
    combinedBuffer
  );
  const blob = new Blob([decryptedBuffer], { type });
  const url = URL.createObjectURL(blob);
  return { url };
}
export function arrayBufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
