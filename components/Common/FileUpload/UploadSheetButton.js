import Image from "next/image";
import styles from "./LandingButtons.module.css"
import { useSession } from 'next-auth/react';
import { useState, useRef } from "react";
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { google } from 'googleapis';
import UploadOverlay from "./UploadOverlay";

export default function UploadSheetButton({handleFile, setSheet, caption}) {
  const [fileStatus, setFileStatus] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const inputRef = useRef();
  const session = useSession().data;

  // Runs handle file found in the landing index.js
  const handleSheet = async (event) => {
    setFileStatus( await handleFile(event, setSheet, setPreviewImage));
    setShowOverlay(false);
  }

  // Displays green/red tinge on input based on validity of uploaded file.
  const showFileStatus = (fileStatus) => {
    return fileStatus == null ? '' : fileStatus == true ? styles.overlayContainerFileSuccess : styles.overlayContainerFileFail;
  }

  const triggerLocalUpload = () => {
    inputRef.current.click();
  }

  const triggerGoogleDriveUpload = async (event) => {
    setFileStatus( await handleFile(event, setSheet, setPreviewImage));
    setShowOverlay(false);
  }

  const handleUploadClick = () => {
    setShowOverlay(true);
    //triggerLocalUpload();
  };

  const hideOverlay = () => {
    setShowOverlay(false);
  };



  return (
    <div>
      <div className={`${showFileStatus(fileStatus)} bg-white w-70 h-99 rounded-md mx-8 my-4 cursor-pointer relative overflow-hidden`}
      onClick={handleUploadClick}>
        <Image className="max-w-100 max-h-100" alt="img" fill={true} src={previewImage ? previewImage : 'https://picsum.photos/200/300'}/>
        <div className={`${styles.overlay}`}>
          <input className={`${styles.fileInput}`} type="file" accept=".pdf" onChange={handleSheet} color="rgba(0,0,0,0)" ref={inputRef}/>
          <svg className={`${styles.uploadIcon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path fill="currentColor" d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
          <p className={`${styles.caption}`}>{caption}</p>
        </div>
      </div>
      {showOverlay && <UploadOverlay 
      showOverlay={showOverlay}
      hideOverlay={hideOverlay}
      caption={"Upload " + caption}
      localFileUpload={triggerLocalUpload}
      gDriveFileUpload={triggerGoogleDriveUpload}
      />}
    </div>
    

  )

}