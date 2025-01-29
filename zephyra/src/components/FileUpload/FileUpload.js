import { Button } from "react-bootstrap";
import React, { useRef } from "react";
import { arrayBufferToHex, encryptFiles } from "utils/cryptoUtils";
import { addFiles } from "features/files/filesSlice";
import { useDispatch } from "react-redux";
import customFetch from "utils/customFetch";

const FileUpload = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const encryptedFiles = await encryptFiles(files);
    const uploadedFiles = await uploadEncryptedFiles(encryptedFiles);
    console.log(uploadedFiles);
    dispatch(addFiles(uploadedFiles));
  };
  const uploadEncryptedFiles = async (/** @type {any[]} */ encryptedFiles) => {
    const uploadedFiles = [];

    await Promise.all(
      encryptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", new Blob([file.encryptedBuffer]), file.name);
        formData.append("iv", arrayBufferToHex(file.iv));
        formData.append("dateModified", file.dateModified);
        formData.append("size", file.size);
        const keyBuffer = await window.crypto.subtle.exportKey("raw", file.key);
        formData.append("key", arrayBufferToHex(keyBuffer)); // Convert key to hex string
        formData.append("fileType", file.type); // Append fileType

        const response = await customFetch(
          `${process.env.REACT_APP_API_BASE_URL}/mynewapp/upload/`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          console.log("Uploaded file:", responseData.name);
          uploadedFiles.push({
            name: responseData.name,
            iv: responseData.iv,
            tag: responseData.tag,
            size: file.size,
            uploaded_at: responseData.uploaded_at,
          });
        } else {
          console.error("Failed to upload file:", file.name);
        }
      })
    );
    return uploadedFiles;
  };

  return (
    <span className="file-upload" data-testid="file-upload-input">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <Button
        variant="primary"
        onClick={handleButtonClick}
        style={{ margin: "20px" }}
      >
        Upload Files
      </Button>
    </span>
  );
};

export default FileUpload;
