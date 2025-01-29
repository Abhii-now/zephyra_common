import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "../features/files/filesSlice";
import shareableLinkReducer from "../features/shareableLink/shareableLinkSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    files: filesReducer,
    shareableLink: shareableLinkReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
