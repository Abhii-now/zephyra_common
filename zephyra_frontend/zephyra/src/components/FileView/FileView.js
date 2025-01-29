import React, { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Button, Modal } from "react-bootstrap";
import customFetch from "utils/customFetch";
import { useNavigate, useParams } from "react-router-dom";
import { decryptFileData, downloadFile } from "utils/fileUtil";

const FileView = ({ fileData: initialFileData, userData }) => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [fileData, setFileData] = useState(initialFileData);

  useEffect(() => {
    const fetchFileDetailsFromToken = async (token) => {
      const formData = new FormData();
      formData.append("userId", userData.user_id);
      formData.append("token", token);
      const response = await customFetch(
        `${process.env.REACT_APP_API_BASE_URL}/mynewapp/file-details-token/`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        handleClose();
      }
      const responseData = await response.json();
      return responseData;
    };
    const fetchFileData = async () => {
      if (token && token.length > 0) {
        const fileData = await fetchFileDetailsFromToken(token);
        const decryptedData = await decryptFileData(fileData);
        setFileData({ ...decryptedData, linkType: fileData.linkType });
        console.log(fileData);
      }
    };
    fetchFileData();
  }, [token]);
  const handleClose = () => {
    navigate("/", { state: { resetFileDownload: true } }); // Navigate to base route
  };
  const downloadSelectedFile = () => {
    downloadFile(fileData);
  };
  return (
    <>
      {fileData && (
        <Modal show={true} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{fileData.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DocViewer
              documents={[{ uri: fileData.url }]}
              pluginRenderers={DocViewerRenderers}
              config={{ header: { disableHeader: true } }}
            />
          </Modal.Body>
          <Modal.Footer>
            {fileData.linkType === "download" && (
              <Button variant="primary" onClick={downloadSelectedFile}>
                Download
              </Button>
            )}
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
export default FileView;
