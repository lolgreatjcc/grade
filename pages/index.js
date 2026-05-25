import AnswerKeyButton from "@/components/Landing/AnswerKeyButton";
import AnswerSheetButton from "@/components/Landing/AnswerSheetButton";
import GradeButton from "@/components/Landing/GradeButton";
import Logo from "@/components/Logo";
import styles from './index.module.css';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="absolute"><Logo /></div>
      <div className="absolute">
        

      </div>
      <div className="absolute bottom-10 right-10">
        <h2 className={`${styles.tutorialBtnTxt} text-2xl`}>Need a tutorial?</h2>
      </div>
      <div
        className={`min-h-screen flex items-center justify-center flex-col`}
      >
        <div className="flex">

          <AnswerSheetButton />

          <AnswerKeyButton />

        </div>

        <GradeButton />
      </div>


    </div>
  );

}
