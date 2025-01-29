import { render, screen } from "@testing-library/react";
import App from "./App";
import React from "react";

test("renders FileUpload component", () => {
  render(<App />);
  const fileUploadInput = screen.getByTestId("file-upload-input");
  expect(fileUploadInput).toBeInTheDocument();
});

test("renders FileGrid component", () => {
  render(<App />);
  const fileUploadInput = screen.getByTestId("file-grid-input");
  expect(fileUploadInput).toBeInTheDocument();
});
