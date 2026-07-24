import styles from './UploadOverlay.module.css'
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { handleSignOut, handleSignIn } from '@/utils/googleAuth';

export default function ItemSelect({selectedFileId, setSelectedFileId, file, fetchFolder, depth = 1}) {
  const [childData, setChildData] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [folderHasCompatibleFiles, setFolderHasCompatibleFiles] = useState(true);
  const indentation = depth * 5;

  // if item is a file, set the selected id (not confirmed, just selected)
  // if item is a folder, get inner files. if inner
  // files are already populated, toggle folder expansion.
  const handleOnClick = async () => {
    if (file.type === 'file') {
      setSelectedFileId(file.id);
    } else {
      if (childData.length > 0) {
        setExpanded(!expanded);
      } else if (!isLoading && folderHasCompatibleFiles) {
        const tempChildData = await fetchFolder(setIsLoading, file.id);
        setChildData(tempChildData);
        if (tempChildData.length === 0) setFolderHasCompatibleFiles(false);
      };
    };
  };

  // highlights item if it is selected
  useEffect(() => {
    if (file.id === selectedFileId) setIsSelected(true);
    else setIsSelected(false);
  }, [selectedFileId])

  return (
    <div className="cursor-pointer mx-4">
      <div className={`flex items-center py-2 pl-2 ${isSelected ? styles.activeButton : ''}`} onClick={handleOnClick}>
        <Image className="w-[16px] h-[16px]" alt="img" width={16} height={16} src={file.icon}/>
        <h1 className={"ml-2"}>{file.name}</h1>
        {isLoading && <h1 className={`${styles.unselected} ml-2`}>(Loading...)</h1>}
        {!folderHasCompatibleFiles && <h1 className={`${styles.unselected} ml-2`}>(No compatible files)</h1>}
      </div>
      {depth == 1 && <div className={'w-full border-1'}/>}
        {expanded && childData.length > 0 && 
          <div>
            {childData.map(
            child => <ItemSelect setSelectedFileId={setSelectedFileId} file={child}
            fetchFolder={fetchFolder} depth={depth + 1} 
            selectedFileId={selectedFileId} key={file.id}/>
            )}
          </div>
        }
    </div>
  )
}