'use-client';

import MarkSection from "@/components/Grade/MarkSection";
import styles from './index.module.css';
import exampleQuizPage from "./exampleQuiz.png"
import NextImage from "next/image";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { useRouter } from "next/router";
import GradeExitBtn from "@/components/Grade/GradeExitBtn";
// import config from "@/config";
import axios from "axios";
import QuestionOverlay from "@/components/Grade/QuestionOverlay";
import { useAnswerSheetStore } from "../../providers/answerSheetStoreProvider";

export default function Grade() {

  const [initPage, setInitPage] = useState(true);

  const [markedData, setMarkedData] = useLocalStorage("grade-markedData");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImage, setCurrentImage] = useState(null);
  const [minPage, setMinPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [currentQuestionList, setCurrentQuestionList] = useState([]);
  const { resetAnswerSheetImageArr } = useAnswerSheetStore((state) => state,);
  const answerSheetImageArr = useAnswerSheetStore((state) => state.answerSheetImageArr);

  const [questionOverlays, setQuestionOverlays] = useState([]);

  // Finds smallest page and associated questions on first load..
  useEffect(() => {
    if (markedData && initPage) {
      let questions = markedData.questions;
      let lowestPage = questions[0].questionPage;
      let highestPage = questions[0].questionPage;

      for (let i = 1; i < markedData.questions.length; i++) {
        if (markedData.questions[i].questionPage < lowestPage) {
          lowestPage = markedData.questions[i].questionPage
        }

        if (markedData.questions[i].questionPage > highestPage) {
          highestPage = markedData.questions[i].questionPage
        }
      }

      const newCurrentQuestionList = [];
      for (let i = 0; i < markedData.questions.length; i++) {
        if (markedData.questions[i].questionPage == lowestPage) {
          newCurrentQuestionList.push(markedData.questions[i]);
        }
      }

      setCurrentPage(lowestPage);
      setMinPage(lowestPage);
      setMaxPage(highestPage);
      setCurrentImage(answerSheetImageArr[lowestPage - 1].dataUrl)
      setCurrentQuestionList(newCurrentQuestionList);
      setInitPage(false);
    }
  }, [markedData])


  // Finds associated questions when current page changes..
  // Fix with uuid...
  useEffect(() => {
    let newCurrentQuestionList = [];
    for (let i = 0; i < markedData.questions.length; i++) {
      if (markedData.questions[i].questionPage == currentPage) {
        newCurrentQuestionList.push(markedData.questions[i]);
      }
    }
    setCurrentQuestionList(newCurrentQuestionList);

    let newCurrentImage = answerSheetImageArr[currentPage - 1].dataUrl;
    setCurrentImage(newCurrentImage);


  }, [currentPage, markedData])

  useEffect(() => {
    let resolvedBoundaries = true;
    for (let i = 0; i < currentQuestionList.length; i++) {
      resolvedBoundaries = currentQuestionList[i].topLeftCoordinate ? true : false;
    }

    if (resolvedBoundaries == false && markedData && newCurrentImage) {
      const requestBody = {
        questions: newCurrentQuestionList,
        pageImage: currentImage
      }
      axios.post(`${config.backendBaseUrl}/grade/marking`, requestBody).then(result => {

        const newMarkedData = markedData;

        for (let i = 0; i < result.data.questions.length; i++) {

          const currentQuestion = result.data.questions[i];

          for (let j = 0; j < markedData.questions.length; j++) {
            const currentCachedQuestion = markedData.questions[j];
            if (currentQuestion.uuid == currentCachedQuestion.uuid) {
              newMarkedData.questions[j].topLeftCoordinate = currentQuestion.top_left_coordinate;
              newMarkedData.questions[j].bottomRightCoordinate = currentQuestion.bottom_right_coordinate;
            }
          }

        }
        setMarkedData(newMarkedData);

      }).catch((err) => {
        console.log(err);
      });
    } 


  }, [currentQuestionList, currentImage]);







  const listMarkSections = currentQuestionList.map((question, index) => {

    return (
      <MarkSection key={index} correctness={question.userCorrectness}
        correctnessMessage={question.whereUserWentWrong}
        elaborationText={question.keyIdea}
        userAnswer={question.userAnswer}
        correctAnswer={question.correctAnswer}
        questionNumber={question.questionNumber}
        questionText={question.questionText}
      />
    )
  });

  const handleNextPage = () => {
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handlePrevPage = () => {
    if (currentPage > minPage) {
      setCurrentPage(currentPage - 1);
    }
  }



  const listQuestionOverlays = currentQuestionList.map((question, index) => {
    return (
      <QuestionOverlay question={question} currentImage={currentImage}/>
    )
  })

  return (
    <div className="min-h-screen">
      <div className="absolute flex justify-between w-screen">

        <GradeExitBtn />


        {/* <div className="pt-3 pe-3">
          <h1 className={`${styles.score} text-xl`}>17 / 25</h1>
        </div> */}
      </div>

      <div className={`${styles.mainParent} grid grid-cols-12 p-15`}>
        <div className="col-span-4 max-h-[95vh]">
          <div className={`relative ${styles.quizPageParent}`}>
          { answerSheetImageArr != null ?
            <NextImage className={`${styles.quizPage} col-span-5`} src={answerSheetImageArr[currentPage - 1].dataUrl} width={500} height={1000} alt="quiz" /> :
            <NextImage className={`${styles.quizPage} col-span-5`} src={null} width={500} height={1000} alt="quiz" />
            }
            {listQuestionOverlays}
            {/* <QuestionOverlay />
            <div className={`${styles.questionBoundary}`} style={{ top: '59%', left: '7%', right: '10%', bottom: '8%' }} /> */}
          </div>

        </div>
        <div layout className="col-span-8 flex flex-col justify-between max-h-[95vh]">
          <div>
            <LayoutGroup className="flex-grow-1">
              {listMarkSections}
            </LayoutGroup>
          </div>
          <div className="flex justify-center align-center">
            <div className="flex items-center">
              <div className="p-5" onClick={handlePrevPage}>
                <svg className={`${styles.quizNavigationBack}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
              </div>
              <h1 className={`${styles.quizNavText}`}>{currentPage} of {maxPage}</h1>
              <div className={`p-5 ${styles.quizNavigationForward}`} onClick={handleNextPage}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

}
