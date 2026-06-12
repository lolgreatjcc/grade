
import { useEffect, useState } from 'react';
import styles from './QuestionOverlay.module.css'

export default function QuestionOverlay({ question, currentImage }) {



  const [imageHeight, setImageHeight] = useState(1);
  const [imageWidth, setImageWidth] = useState(1);

  useEffect(() => {
    if (!currentImage) return;

    const parseImage = new Image();

    parseImage.onload = () => {
      setImageHeight(parseImage.naturalHeight);
      setImageWidth(parseImage.naturalWidth);
    }

    parseImage.src = currentImage;
  }, [currentImage])


  const topLeftCoordinate = question.topLeftCoordinate;
  const topLeftX = topLeftCoordinate[0];
  const topLeftY = topLeftCoordinate[1];

  const leftOffset = topLeftX/imageWidth * 100;
  const topOffset = topLeftY/imageHeight * 100;

  const bottomRightCoordinate = question.bottomRightCoordinate;
  const bottomRightX = bottomRightCoordinate[0];
  const bottomRightY = bottomRightCoordinate[1];

  const rightOffset = 100 - (bottomRightX/imageWidth*100);
  const bottomOffset = 100 - (bottomRightY/imageHeight*100);




  // should do validation for offsets...




  return (
    <div className={`${styles.questionBoundary}`} style={{ top: topOffset + '%', left: leftOffset + '%', right: rightOffset + '%', bottom: bottomOffset + '%' }} />
  )
}