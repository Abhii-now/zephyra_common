import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./style.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useLocation } from "react-router-dom";
import { downloadFile, fetchFile } from "utils/fileUtil";
import FileView from "components/FileView/FileView";
import ShareableLinkModal from "components/ShareableLinkModal/ShareableLinkModal";
// Configure PDF.js worker

/**
 * @typedef {Object} RootState
 * @property {Object} files
 * @property {File[]} files.selectedFiles
 */

const FileDownload = () => {
  const location = useLocation();
  const selectedFiles = useSelector(
    /**
     * @param {RootState} state
     * @returns {File[]}
     */ (state) => state.files.selectedFiles
  );
  const [showModal, setShowModal] = useState(false);
  const [fileData, setFileData] = useState({ url: null, name: "", type: "" });
  const [showShareableLinkModal, setShowShareableLinkModal] = useState(false);

  useEffect(() => {
    if (location.state?.resetFileDownload) {
      // Reset state when navigating back to base route
      setShowModal(false);
      setFileData({ url: null, name: "", type: "" });
      setShowModal(false);
    }
  }, [location.state]);

  const viewSelectedFiles = async () => {
    for (const file of selectedFiles) {
      try {
        // Fetch the file contents from the server or handle the file data as needed
        const fileData = await fetchFile(file.name);
        setFileData(fileData);
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
        setFileData(fileData);
        downloadFile(fileData);
      } catch (error) {
        console.error(`Error processing file: ${file.name}`, error);
        console.log(error.message);
      }
    }
  };
  return (
    <>
      <Button
        variant="primary"
        onClick={viewSelectedFiles}
        disabled={selectedFiles.length !== 1}
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
        onClick={() => setShowShareableLinkModal(true)}
        disabled={selectedFiles.length === 0}
        style={{ margin: "10px" }}
      >
        Generate Shareable Link
      </Button>
      {showModal && <FileView fileData={fileData} userData={undefined} />}
      <ShareableLinkModal
        show={showShareableLinkModal}
        handleClose={() => setShowShareableLinkModal(false)}
      />
    </>
  );
};

export default FileDownload;
