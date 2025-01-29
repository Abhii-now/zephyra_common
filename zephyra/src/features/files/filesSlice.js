import { createSlice } from "@reduxjs/toolkit";

const filesSlice = createSlice({
  name: "files",
  initialState: { files: [], selectedFiles: [] },
  reducers: {
    addFiles: (state, action) => {
      console.log(action.payload);
      state.files.push(...action.payload);
    },
    setSelectedFiles: (state, action) => {
      state.selectedFiles = action.payload;
    },
  },
});

export const { addFiles, setSelectedFiles } = filesSlice.actions;
export default filesSlice.reducer;
