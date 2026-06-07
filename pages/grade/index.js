import MarkSection from "@/components/Grade/MarkSection";
import styles from './index.module.css';
import exampleQuizPage from "./exampleQuiz.png"
import Image from "next/image";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { useRouter } from "next/router";

export default function Grade() {

  const [markedData, setMarkedData] = useLocalStorage("grade-markedData");
  const [answerSheetImageArr, saveAnswerSheetImageArr] = useLocalStorage("grade-answerSheet");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPage, setMinPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [currentQuestionList, setCurrentQuestionList] = useState([]);


  // Finds smallest page and associated questions on first load..
  useEffect(() => {
    if (markedData) {
      let questions = markedData.questions;
      let lowestPage = questions[0].questionPage;
      let highestPage = questions[0].questionPage;

      for (let i = 1; i < markedData.questions.length; i++) {
        if (markedData.questions[i].questionPage < lowestPage) {
          lowestPage = markedData.questions[i].questionPage
        }

        if(markedData.questions[i].questionPage > highestPage) {
          highestPage = markedData.questions[i].questionPage
        }
      }

      const newCurrentQuestionList = [];
      for (let i = 0; i < markedData.questions.length; i++) {
        if (markedData.questions[i].questionPage == currentPage) {
          newCurrentQuestionList.push(markedData.questions[i]);
        }
      }

      setCurrentPage(lowestPage);
      setMinPage(lowestPage);
      setMaxPage(highestPage);
      setCurrentQuestionList(newCurrentQuestionList);
    }
  }, [markedData])

  // Finds associated questions when current page changes..
  useEffect(() => {
    const newCurrentQuestionList = [];
    for (let i = 0; i < markedData.questions.length; i++) {
      if (markedData.questions[i].questionPage == currentPage) {
        newCurrentQuestionList.push(markedData.questions[i]);
      }
    }
    setCurrentQuestionList(newCurrentQuestionList);
  }, [currentPage])

  



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
    if(currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handlePrevPage = () => {
    if(currentPage > minPage) {
      setCurrentPage(currentPage - 1);
    }
  }

  const router = useRouter();
  const handleExit = () => {
    setMarkedData(null);
    router.back();
  }


  return (
    <div className="min-h-screen">
      <div className="absolute flex justify-between w-screen">

        <div className={`${styles.exitParent} flex items-center pt-3 ps-3`} onClick={handleExit}>
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
            <path d="m274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z" />
          </svg>
          <h1 className="text-xl ms-3">Exit</h1>
        </div>


        {/* <div className="pt-3 pe-3">
          <h1 className={`${styles.score} text-xl`}>17 / 25</h1>
        </div> */}
      </div>

      <div className={`${styles.mainParent} grid grid-cols-12 p-15  `}>
          <Image className={`${styles.quizPage} col-span-5`} src={answerSheetImageArr[currentPage-1]?.dataUrl} width={500} height={1000} alt="quiz" /> 
        <div layout className="col-span-7 flex flex-col justify-between">
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
