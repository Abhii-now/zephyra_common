import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import customFetch from "../../utils/customFetch";
import { useDispatch, useSelector } from "react-redux";
import {
  setShareableLink,
  setShowAlert,
} from "features/shareableLink/shareableLinkSlice";
/**
 * @typedef {Object} RootState
 * @property {Object} files
 * @property {File[]} files.selectedFiles
 */
const ShareableLinkModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  /**
   * @typedef {Object} User
   * @property {string} user_id
   * @property {string} name
   */
  const [selectedUser, setSelectedUser] = useState([]);
  const [linkType, setLinkType] = useState("view");
  const [error, setError] = useState("");

  const selectedFiles = useSelector(
    /**
     * @param {RootState} state
     * @returns {File[]}
     */ (state) => state.files.selectedFiles
  );
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await customFetch(
          `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users`,
          {},
          true
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleGenerateLink = async () => {
    if (selectedUser.length === 0) {
      setError("Please select at least one user.");
      return;
    }
    if (!linkType) {
      setError("Please select a link type.");
      return;
    }
    setError("");
    for (const file of selectedFiles) {
      try {
        const formData = new FormData();
        const selectedUserIds = selectedUser.map((user) => user.user_id);
        formData.append("userId", JSON.stringify(selectedUserIds));
        formData.append("filename", file.name);
        formData.append("linkType", linkType);

        const response = await customFetch(
          `${process.env.REACT_APP_API_BASE_URL}/mynewapp/generate-sharable-token/`,
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
        break;
      } catch (error) {
        console.error(
          `Error generating shareable link for file: ${file.name}`,
          error
        );
      }
    }
    handleClose();
  };

  const handleUserChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        const user = users.find((user) => user.user_id === options[i].value);
        selected.push(user);
      }
    }
    setSelectedUser(selected);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      {/* <>{selectedUser.name}</> */}
      <Modal.Header closeButton>
        <Modal.Title>Generate Shareable Link</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="formUserSelect">
            <Form.Label>Select User</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={selectedUser.map((user) => user.user_id)}
              onChange={handleUserChange}
            >
              {/* <option value="">Select a users</option> */}
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formLinkTypeSelect">
            <Form.Label>Select Link Type</Form.Label>
            <Form.Control
              as="select"
              value={linkType}
              onChange={(e) => setLinkType(e.target.value)}
            >
              <option value="view">View</option>
              <option value="download">Download</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleGenerateLink}>
          Generate Link
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareableLinkModal;
