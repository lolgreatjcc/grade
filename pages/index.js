import AnswerKeyButton from "@/components/Landing/AnswerKeyButton";
import AnswerSheetButton from "@/components/Landing/AnswerSheetButton";
import Logo from "@/components/Logo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="absolute"><Logo /></div>
      <div
        className={`min-h-screen flex items-center justify-center font-sans dark:bg-black`}
      >
        <div className="flex">

          <AnswerSheetButton />

          <AnswerKeyButton />

        </div>
      </div>
    </div>
  );

}
