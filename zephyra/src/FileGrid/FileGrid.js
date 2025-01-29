// filepath: /Users/abhinavjain/dev/zephyra/zephyra/src/FileGrid.js
import React, { useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllEnterpriseModule,
  ModuleRegistry,
  themeAlpine,
} from "ag-grid-enterprise";
import { useDispatch, useSelector } from "react-redux";
import { addFiles, setSelectedFiles } from "features/files/filesSlice";
import customFetch from "utils/customFetch";
import {
  setError,
  setShowAlert,
} from "features/shareableLink/shareableLinkSlice";

ModuleRegistry.registerModules([AllEnterpriseModule]);

const FileGrid = () => {
  const dispatch = useDispatch();
  const selectFiles = (state) => state.files;
  const files = useSelector(selectFiles).files;

  const fetchFiles = async () => {
    try {
      const response = await customFetch(
        `${process.env.REACT_APP_API_BASE_URL}/mynewapp/files/`
      );
      if (response.ok) {
        const files = await response.json();
        console.log(files.files);
        dispatch(addFiles(files.files));
      } else {
        throw new Error("Failed to fetch files");
      }
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setShowAlert(true));
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);
  const columns = [
    { headerName: "File Name", field: "name" },
    { headerName: "File Size (bytes)", field: "size" },
    { headerName: "Last Modified", field: "uploaded_at" },
  ];
  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    dispatch(setSelectedFiles(selectedData));
  };
  return (
    <div
      className="ag-theme-alpine"
      data-testid="file-grid"
      style={{ height: 500, width: "80%", margin: "auto" }}
    >
      <AgGridReact
        theme={themeAlpine}
        onSelectionChanged={onSelectionChanged}
        rowData={files}
        columnDefs={columns}
        defaultColDef={{ flex: 1, minWidth: 150 }}
        rowSelection="multiple"
      />
    </div>
  );
};

export default FileGrid;
