
import { useState } from "react";
import styles from "./QnSheetButton.module.css"
import Image from "next/image";
import { pdfToImg } from "pdftoimg-js/browser";


export default function QnSheetButton({ handleFile, setQnSheet }) {
  const [fileStatus, setFileStatus] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleUpload = async (event) => {
    setFileStatus(await handleFile(event, setQnSheet, setPreviewImage))
  }

  const showFileStatus = (fileStatus) => {
    return fileStatus == null ? '' : fileStatus == true ? styles.overlayContainerFileSuccess : styles.overlayContainerFileFail;
  }
  return (
    <div className={`${showFileStatus(fileStatus)} bg-white w-70 h-99 rounded-md m-8 relative overflow-hidden`}>
      <Image className="max-w-100 max-h-100" alt="img" fill={true} src={previewImage ? previewImage : 'https://picsum.photos/200/300'} />

      <div className={`${styles.overlay}`}>
        <input className={`${styles.fileInput}`} type="file" accept=".pdf" onChange={handleUpload} color="rgba(0,0,0,0)" />
        <svg className={`${styles.uploadIcon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path fill="currentColor" d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
        <p className={`${styles.caption}`}>Question Paper</p>
      </div>
    </div>
  )
}