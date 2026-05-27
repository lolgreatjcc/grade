import MarkSection from "@/components/Grade/MarkSection";
import styles from './index.module.css';
import exampleQuizPage from "./exampleQuiz.png"
import Image from "next/image";

export default function Grade() {
  return (
    <div className="min-h-screen">
      <div className="absolute flex justify-between w-screen">

        <div className={`${styles.exitParent} flex items-center pt-3 ps-3`}>
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
            <path d="m274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z" />
          </svg>
          <h1 className="text-xl ms-3">Exit</h1>
        </div>


        <div className="pt-3 pe-3">
          <h1 className={`${styles.score} text-xl`}>17 / 25</h1>
        </div>
      </div>

      <div className={`${styles.mainParent} grid grid-cols-12 p-15`}>


        <Image className={`${styles.quizPage} col-span-5`} src={exampleQuizPage} alt="quiz" />
        <div className="col-span-7 flex flex-col justify-between">
          <div className="flex-grow-1">
            <MarkSection />
            <MarkSection />
            <MarkSection />
          </div>
          <div className="flex justify-center align-center">
            <div className="flex items-center">
              <div className="p-5">
                <svg className={`${styles.quizNavigationBack}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
              </div>
              <h1 className={`${styles.quizNavText}`}>1 of 2</h1>
              <div className="p-5">
                <svg className={`${styles.quizNavigationForward}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

}
