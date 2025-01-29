import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore, { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import FileUpload from "./FileUpload";
import * as cryptoUtils from "../../utils/cryptoUtils";
import React from "react";
import filesReducer from "../../features/files/filesSlice";

jest.mock("../utils/cryptoUtils", () => ({
  encryptFiles: jest.fn(),
  arrayBufferToHex: jest.fn((buffer) =>
    Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  ),
}));

describe("FileUpload", () => {
  let store;

  beforeEach(() => {
    const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
    store = createStoreWithMiddleware(filesReducer);

    jest.spyOn(cryptoUtils, "encryptFiles").mockImplementation((files) =>
      Promise.resolve(
        files.map((file) => ({
          name: file.name,
          size: file.size,
          lastModifiedDate: file.lastModifiedDate,
          encryptedBuffer: new ArrayBuffer(8),
          iv: new Uint8Array(12),
          key: {
            type: "secret",
            algorithm: { name: "AES-GCM" },
            extractable: true,
            usages: ["encrypt", "decrypt"],
          },
        }))
      )
    );
  });

  test("should render the file upload component", () => {
    render(
      <Provider store={store}>
        <FileUpload />
      </Provider>
    );

    expect(screen.getByText("Upload Files")).toBeInTheDocument();
  });

  test("should handle file upload", async () => {
    render(
      <Provider store={store}>
        <FileUpload />
      </Provider>
    );

    const fileInput = screen.getByTestId("file-upload-input");
    const file = new File(["Hello, world!"], "hello.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(cryptoUtils.encryptFiles).toHaveBeenCalledWith([file]);
    });

    expect(store.getActions()).toEqual([
      {
        type: "files/addFiles",
        payload: [
          {
            name: "hello.txt",
            size: 13,
            lastModifiedDate: expect.any(Date),
            encryptedBuffer: expect.any(ArrayBuffer),
            iv: expect.any(Uint8Array),
            key: expect.any(Object),
          },
        ],
      },
    ]);
  });
});
