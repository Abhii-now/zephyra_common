import { createSlice } from "@reduxjs/toolkit";

const shareableLinkSlice = createSlice({
  name: "shareableLink",
  initialState: { link: "", showAlert: false, error: "" },
  reducers: {
    setShareableLink: (state, action) => {
      state.link = action.payload;
    },
    setShowAlert: (state, action) => {
      state.showAlert = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setShareableLink, setShowAlert, setError } =
  shareableLinkSlice.actions;
export default shareableLinkSlice.reducer;
