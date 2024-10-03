import { createRef, useState } from "react";
import fileToBase64 from "../util/fileToBase64";
import pdfToText from "../util/pdfToText";
import styles from "../styles/Components.module.css";
import type { PdfDropProps } from "../types";

const PdfDrop = ({ onChange }: PdfDropProps) => {
  // States
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = createRef<HTMLInputElement>();

  // Handle file drag
  function onDrag(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === "dragenter" || event.type === "dragover") setDragActive(true);
    else if (event.type === "dragleave") setDragActive(false);
    setFileError("");
  }

  // Handle file drop
  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) handleFile(event.dataTransfer.files[0]);
  }

  // Handle dropzone click (to open file manager)
  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    fileInputRef.current?.click();
  }

  // Handle file input change
  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) handleFile(event.target.files[0]);
  }

  // Handle file (from file to text)
  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setFileError("Please upload a pdf document!");
      return;
    }

    const base64 = await fileToBase64(file)
      .catch((error) => {
        setFileError(`Error while converting pdf file: ${error}`);
        return;
      });
    if (!base64) return;

    const content = await pdfToText(base64)
      .catch((error) => {
        setFileError(`Error while reading pdf file: ${error}`);
        return;
      });
    if (!content) return;

    if (content.length > 1000000) {
      setFileError("Content is too large (max 1M characters)!");
      return;
    }

    onChange(content);
  }

  // JSX to render
  return (
    <div className={styles.flexCenter}>
      <div
        className={styles.dropzone + " " + styles.flexCenter + (dragActive ? " "+styles.active : "")}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDropCapture={onDrop}
        onClick={onClick}
      >
        {fileError ? (
          <p className={styles.error}>{fileError}</p>
        ) : dragActive ? (
          <b>Let go to add pdf!</b>
        ) : (
          <i>Drag a pdf to here (or click here)</i>
        )}
      </div>
      {/* When clicking on the dropzone, this hidden input is activated to provide a filemanager */}
      <input
        type={"file"}
        accept={"application/pdf"}
        className={styles.hidden}
        ref={fileInputRef}
        onChange={onInputChange}
      />
    </div>
  );
};

export default PdfDrop;