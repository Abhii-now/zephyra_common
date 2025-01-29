import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./style.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useNavigate, useParams } from "react-router-dom";
import { decryptFile } from "utils/cryptoUtils";
import {
  setShowAlert,
  setShareableLink,
} from "features/shareableLink/shareableLinkSlice";
import { useDispatch } from "react-redux";
import customFetch from "utils/customFetch";
// Configure PDF.js worker

/**
 * @typedef {Object} RootState
 * @property {Object} files
 * @property {File[]} files.selectedFiles
 */

const FileDownload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useParams();
  const selectedFiles = useSelector(
    /**
     * @param {RootState} state
     * @returns {File[]}
     */ (state) => state.files.selectedFiles
  );
  const [showModal, setShowModal] = useState(false);
  const [fileData, setFileData] = useState({ url: null, name: "", type: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        console.log(token);
        const fileData = await fetchFileDetailsFromToken(token);
        await fetchFile(fileData.name);
        setShowModal(true);
      }
    };
    fetchData();
  }, [token]);
  const fetchFileDetailsFromToken = async (token) => {
    const response = await customFetch(
      `http://127.0.0.1:8000/mynewapp/file-details-token/?token=${token}`
    );
    console.log(response);
    const responseData = await response.json();
    return responseData;
  };
  const fetchFile = async (fileName) => {
    try {
      const response = await customFetch(
        `http://127.0.0.1:8000/mynewapp/files/${fileName}/`
      );
      if (!response.ok) {
        console.error(`Failed to fetch file: ${fileName}`);
        return;
      }
      const responseData = await response.json();
      const { encrypted_data, key, iv, name, type, tag } = responseData;
      const res = await decryptFile(encrypted_data, key, iv, type, tag);
      const fileData = { url: res.url, name, type };
      setFileData(fileData);
      console.log(fileData.url);
      return fileData;
    } catch (error) {
      console.error(`Error processing file: ${fileName}`, error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setFileData({ url: null, name: "", type: "" });
    navigate("/"); // Navigate to base route
  };
  const viewSelectedFiles = async () => {
    for (const file of selectedFiles) {
      try {
        // Fetch the file contents from the server or handle the file data as needed
        await fetchFile(file.name);
        setShowModal(true);
      } catch (error) {
        console.error(`Error processing file: ${file.name}`, error);
        console.log(error.message);
      }
    }
  };
  const downloadSelectedFiles = async () => {
    for (const file of selectedFiles) {
      try {
        // Fetch the file contents from the server or handle the file data as needed
        const fileData = await fetchFile(file.name);
        // Create download link
        if (fileData.url) {
          const a = document.createElement("a");
          a.href = fileData.url;
          a.download = fileData.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } catch (error) {
        console.error(`Error processing file: ${file.name}`, error);
        console.log(error.message);
      }
    }
  };
  const generateShareableLink = async () => {
    for (const file of selectedFiles) {
      try {
        const formData = new FormData();

        formData.append("filename", file.name);

        const response = await customFetch(
          `http://127.0.0.1:8000/mynewapp/generate-sharable-token/`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to generate shareable link");
        }
        const data = await response.json();
        console.log(data);
        const link = `http://localhost:3000/${data.token}`;
        dispatch(setShareableLink(link));
        dispatch(setShowAlert(true));
      } catch (error) {
        console.error(
          `Error generating shareable link for file: ${file.name}`,
          error
        );
      }
    }
  };
  return (
    <>
      <Button
        variant="primary"
        onClick={viewSelectedFiles}
        disabled={selectedFiles.length === 0}
        style={{ margin: "10px" }}
      >
        View Selected Files
      </Button>
      <Button
        variant="primary"
        onClick={downloadSelectedFiles}
        disabled={selectedFiles.length === 0}
        style={{ margin: "10px" }}
      >
        Download Selected Files
      </Button>
      <Button
        variant="primary"
        onClick={generateShareableLink}
        disabled={selectedFiles.length === 0}
        style={{ margin: "10px" }}
      >
        Generate Shareable Link
      </Button>
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{fileData.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fileData.type.startsWith("text/") ? (
            <pre>{fileData.type}</pre>
          ) : (
            <DocViewer
              documents={[{ uri: fileData.url }]}
              pluginRenderers={DocViewerRenderers}
              config={{ header: { disableHeader: true } }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FileDownload;
