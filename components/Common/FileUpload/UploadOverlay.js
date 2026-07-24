import styles from './UploadOverlay.module.css'
import { useEffect, useState } from "react";
import { pdfToImg } from "pdftoimg-js/browser";
import { motion } from "motion/react";
import axios from "axios";
import UploadSheetButton from "./UploadSheetButton";
import GoogleDriveOverlay from './GoogleDriveOverlay';

export default function UploadOverlay({ showOverlay = false, hideOverlay, localFileUpload, gDriveFileUpload, caption}) {
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  const getGoogleDriveFile = async () => {
    setShowGooglePicker(true);
  }

  const hideGooglePicker = () => {
    setShowGooglePicker(false)
  }

  return (
    <div className={`${styles.generateOverlayParent} z-50 text-[#FFFFFFCC]`}>
      <h1 className={`${styles.headerText}  text-xl`}>{caption}</h1>
      <div className="flex m-4">
      </div>
      <div className='flex items-center'>
        <div className={`w-80 h-110 ${styles.activeButton} 
        rounded-lg flex items-center justify-center cursor-pointer`}
          onClick={getGoogleDriveFile}>
          <h1 className={`text-center`}>Upload from Google Drive</h1>
        </div>
        <div className='h-120 border mx-8 text-[#FFFFFFCC]'/>
        <div className={`w-80 h-110 ${styles.activeButton} 
        bg-black rounded-lg flex items-center justify-center cursor-pointer`}
          onClick={localFileUpload}>
          <h1 className={``}>Upload Local File</h1>
        </div>        
      </div>
      <div className={`w-176 bg-stone-700
       rounded-lg flex items-center justify-center mt-8 py-3 cursor-pointer`}
       onClick={hideOverlay}>
        <h1 className={``}>Back</h1>
      </div>
      {showGooglePicker && <GoogleDriveOverlay showOverlay={showGooglePicker} hideOverlay={hideGooglePicker} gDriveFileUpload={gDriveFileUpload}/>}
    </div>
  )
}