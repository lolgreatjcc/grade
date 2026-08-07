import styles from './UploadOverlay.module.css'
import { useEffect, useState } from "react";
import { pdfToImg } from "pdftoimg-js/browser";
import { motion } from "motion/react";
import axios from "axios";
import UploadSheetButton from "./UploadSheetButton";
import { useSession } from 'next-auth/react';
import { handleSignOut, handleSignIn } from '@/utils/googleAuth';
import ItemSelect from './ItemSelect';

export default function GoogleDriveOverlay({ showOverlay, hideOverlay, gDriveFileUpload, caption = "Select a File" }) {
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  // variable holding the user's root directory data
  const [driveData, setDriveData] = useState([]);

  // edit extensions to be filtered here
  const extensions = ['pdf'];

  // selectedFileId helps to highlight the selected file
  const [selectedFileId, setSelectedFileId] = useState(null);

  // finalFileId contains the confirmed file's Id
  const [finalFileId, setFinalFileId] = useState(null);
  const { data: session, status } = useSession();

  const handleGoogleDriveId = async () => {
    if (selectedFileId) setFinalFileId(selectedFileId);
  }

  // get contents of a folder. Without any folderId, will get the
  // root directory of the user's drive (hence default id of 'root')
  const fetchFolder = async (setIsLoading, folderId = 'root') => {
    // if user is signed in with google
    if (status === 'authenticated') {
      try {
        setIsLoading(true);
        const response = await fetch('/api/folders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({'extensions': extensions, 'folderId': folderId}),
          });

        if (!response.ok) throw new Error("Failed to fetch files in user's drive");
        const data = await response.json();
        return data.structure;
      } catch (error) {
        // likely authentication expired, force a log out
        console.error("Failed to fetch files in user's drive:", error);
        handleSignOut();
      } finally {
        setIsLoading(false);
      }
    } else {
      // if user is not signed in
      handleSignIn();
    }
  };

  // function to retrieve the user's root directory
  const handleInitialData = async () => {
    const initialData = await fetchFolder(setIsLoading);
    setDriveData(initialData);
  }

  // on overlay load, get the root directory data
  useEffect(() => {
    if (showOverlay) handleInitialData();
  }, [session, status, showOverlay]);

  // when the file has been confirmed, download
  useEffect(() => {
    const getDriveFile = async () => {
      if (showOverlay && finalFileId) {
        try {
            setIsLoadingFile(true);
            const response = await fetch('/api/file', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({'fileId': finalFileId}),
            });

            if (!response.ok) throw new Error('Failed to fetch file');

            const {data, name, mimeType} = await response.json();
            const arr = data.split(',');
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            
            const file =  new File([u8arr], name, { type: mimeType });

            // fake event to reuse function expecting event.target.files
            const fakeEvent = {'target': {'files': [file]}}
            gDriveFileUpload(fakeEvent);

          } catch (error) {
            console.error('Error fetching file:', error);
            handleSignOut();
          } finally {
            setIsLoadingFile(false);
          }
      }
    }

    getDriveFile();
  }, [finalFileId])

  const showLoadingFile = () => {
    if (isLoadingFile) return "Loading File..."
    else return "Select File"
  }

  return (
    <div className={`${styles.generateOverlayParent} z-51 text-[#FFFFFFCC]
     ${showOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    transition-opacity duration-200 ease-in-out`}>
      <h1 className={`${styles.headerText}  text-xl mb-2`}>{caption}</h1>
      <div className="w-3/5 h-4/7 border rounded-md overflow-scroll py-4 px-6">
        {isLoading && 
          <div className='h-full w-full flex justify-center items-center'>
              <h1>Loading files from drive...</h1>
          </div>
        }
        {driveData && driveData.map(file => 
              <ItemSelect setSelectedFileId={setSelectedFileId} 
              selectedFileId={selectedFileId} file={file} fetchFolder={fetchFolder}
              depth={1} key={file.id}/>
        )}
      </div>
      <div className={'flex w-3/5 p-2 justify-center'}>
        <div className='w-50 bg-stone-600 rounded items-center cursor-pointer hover:bg-stone-700 transition duration-100' onClick={hideOverlay}>
          <h1 className={`text-center my-5`}>Back</h1>
        </div>
        <div className={`w-50 ${selectedFileId ? styles.activeButton : "bg-stone-700"} 
        ${!isLoadingFile && selectedFileId ? 'cursor-pointer' : 'cursor-not-allowed'} rounded items-center ml-5`}
        onClick={handleGoogleDriveId}>
          <h1 className={`text-center my-5`}>{showLoadingFile()}</h1>
        </div>
      </div>
    </div>
  )
}