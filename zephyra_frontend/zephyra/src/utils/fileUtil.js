import customFetch from "./customFetch";

const { decryptFile } = require("./cryptoUtils");

export const fetchFile = async (fileName, responseFromToken) => {
  try {
    const response = responseFromToken
      ? responseFromToken
      : await customFetch(
          `${process.env.REACT_APP_API_BASE_URL}/mynewapp/files/${fileName}/`
        );
    if (!response.ok) {
      console.error(`Failed to fetch file: ${fileName}`);
      return;
    }
    const responseData = await response.json();
    // const { encrypted_data, key, iv, name, type, tag } = responseData;
    const res = await decryptFileData(responseData);
    const fileData = {
      url: res.url,
      name: res.name,
      type: res.type,
      linkType: res.linkType,
    };
    return fileData;
  } catch (error) {
    console.error(`Error processing file: ${fileName}`, error);
  }
};

export const decryptFileData = async (fileData) => {
  const { encrypted_data, key, iv, name, type, tag } = fileData;
  const res = await decryptFile(encrypted_data, key, iv, type, tag);
  const decryptedFileData = { url: res.url, name, type };
  return decryptedFileData;
};

export const downloadFile = async (fileData) => {
  if (fileData.url) {
    const a = document.createElement("a");
    a.href = fileData.url;
    a.download = fileData.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
