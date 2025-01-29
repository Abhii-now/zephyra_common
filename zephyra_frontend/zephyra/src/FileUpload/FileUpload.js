import { Button } from "react-bootstrap";
import React, { useEffect, useRef } from "react";
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
    console.log(files);
    const encryptedFiles = await encryptFiles(files);
    const uploadedFiles = await uploadEncryptedFiles(encryptedFiles);
    dispatch(addFiles(uploadedFiles));
  };
  const uploadEncryptedFiles = async (encryptedFiles) => {
    const uploadedFiles = [];

    await Promise.all(
      encryptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", new Blob([file.encryptedBuffer]), file.name);
        formData.append("iv", arrayBufferToHex(file.iv));
        formData.append("dateModified", file.dateModified);
        const keyBuffer = await window.crypto.subtle.exportKey("raw", file.key);
        formData.append("key", arrayBufferToHex(keyBuffer)); // Convert key to hex string
        formData.append("fileType", file.type); // Append fileType

        const response = await customFetch(
          "http://127.0.0.1:8000/mynewapp/upload/",
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
            uploaded_at: responseData.uploaded_at,
          });
        } else {
          console.error("Failed to upload file:", file.name);
        }
      })
    );
    return uploadedFiles;
  };
  const fetchFiles = async () => {
    try {
      const response = await customFetch(
        "http://127.0.0.1:8000/mynewapp/files/"
      );
      if (response.ok) {
        const files = await response.json();
        console.log(files.files);
        dispatch(addFiles(files.files));
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);
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
